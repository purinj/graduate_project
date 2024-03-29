from flask import Flask,Response, render_template,request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy 
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_user import login_required, SQLAlchemyAdapter, UserManager, UserMixin
from flask_user import roles_required
import cv2
import psycopg2
import json
from psycopg2.extras import RealDictCursor
from raw_sql_command import *
import base64
import requests
import datetime
from wrapt_timeout_decorator import *


app = Flask(__name__, static_folder='static')

# *** DB Set Up ***
#---------SmartSafety DB ------------#
smartsafty_user = ""
smartsafty_password =""
smartsafty_host = ""
smartsafty_port = "5432"
smartsafty_dbname = ""
### SQLAlchemy Config ####

class ConfigClass(object):
    SQLALCHEMY_DATABASE_URI = 'postgresql://' + smartsafty_user + ':' + smartsafty_password + '@' + smartsafty_host + ':' + smartsafty_port +'/' + smartsafty_dbname
    SECRET_KEY = 'thisissecret'
    USER_LOGIN_URL = '/login'
    USER_LOGIN_TEMPLATE = 'Login.html'
    USER_UNAUTHORIZED_ENDPOINT = "unautorized"



app.config.from_object(__name__+'.ConfigClass')
db = SQLAlchemy(app)
#---------SmartSafety DB ------------#

#---------AXNAPI DB ------------#
AXNAPIdb_user = ""
AXNAPIdb_password = ""
AXNAPIdb_host = ""
AXNAPIdb_port = "5432"
AXNAPIdb_dbname = ""
#---------AXNAPI DB ------------#

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True)
    password = db.Column(db.String(255), nullable=False, server_default='')
    firstname = db.Column(db.String(255), nullable=False, server_default='')
    lastname = db.Column(db.String(255), nullable=False, server_default='')
    organization = db.Column(db.Integer(), db.ForeignKey('organization.id', ondelete='CASCADE'))
    roles = db.relationship('Role', secondary='user_roles',backref=db.backref('users', lazy='dynamic'))

class Role(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(50), unique=True)

class UserRoles(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id', ondelete='CASCADE'))
    role_id = db.Column(db.Integer(), db.ForeignKey('role.id', ondelete='CASCADE'))

class Organization(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(255), unique=True)

# *** DB Set Up ***
db_adapter = SQLAlchemyAdapter(db,  User)
user_manager = UserManager(db_adapter, app)
    
def rowToJson(inputlist):
    text = {}
    for i in inputlist:
            text.update({i[0] : i[1]})    
    return text


def gen(video):
    while True:
        success, image = video.read()
        image = cv2.resize(image, (1280 , 720)) # delete available
        ret, jpeg = cv2.imencode('.jpg', image)
        frame = jpeg.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

def check_video(video):
    try:
        success,image = video.read()
        print(success,image)
        ret,jpeg = cv2.imencode('.jpg', image)
    except cv2.error as e:
      meaage = 'loss'
    else:
       meaage = 'Pass'
    return meaage

def StrtoBase64(strForconverse):
    message = strForconverse
    message_bytes = message.encode('ascii')
    base64_bytes = base64.b64encode(message_bytes)
    base64_message = base64_bytes.decode('ascii')
    return base64_message



## Main Route Start
@app.route('/login')
def login():
    messages = request.args['messages']  # counterpart for url_for()
    messages = session['messages']       # counterpart for session
    return render_template('Login.html', messages=json.loads(messages))

@app.route('/')
@login_required
@roles_required(['Admin','Security','SmartCity','Library','Viewer'])
def index():
    connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
    cur = connection.cursor()
    cur.execute('''select count(*) from all_cameras''')
    all_cam_execute = cur.fetchall()

    cur.execute('''select count(*) from all_cameras where cam_type = 1''')
    normal_cam_execute = cur.fetchall()

    cur.execute('''select count(*) from all_cameras where cam_type = 2''')
    ai_cam_execute = cur.fetchall()

    cur.execute('''select count(*) from all_cameras where cam_type = 3''')
    thermal_cam = cur.fetchall()

    cur.execute('''select count(*) from public.blue_pole''')
    bluepole_amount = cur.fetchall()

    cur.close()
    connection.close()

    axnApi = psycopg2.connect(user=AXNAPIdb_user,password=AXNAPIdb_password,host=AXNAPIdb_host,port=AXNAPIdb_port,database=AXNAPIdb_dbname)
                                  
    cur2 = axnApi.cursor()
    cur2.execute('''SELECT count(*) FROM public.cameras;''')
    smart_pole_amount = cur2.fetchall()
    cur2.close()
    axnApi.close()

    RealallCamera = int(all_cam_execute[0][0]) + int(smart_pole_amount[0][0])
    RealAiCam = int(ai_cam_execute[0][0]) + int(thermal_cam[0][0]) + int(smart_pole_amount[0][0])
    print('all = ',RealallCamera)
    print('ai = ',RealAiCam)
    print('thermal = ',thermal_cam[0][0])
    print('smartpole = ',smart_pole_amount[0][0])
    print('normal = ',normal_cam_execute[0][0])
    print('bluepole = ',bluepole_amount[0][0])
    

    
    return render_template('index.html',amount={'all':RealallCamera,'ai':RealAiCam,'thermal':thermal_cam[0][0],'smartpole':smart_pole_amount[0][0],'normal':normal_cam_execute[0][0],'bluepole':bluepole_amount[0][0]},user_msg={'firstname':current_user.firstname,'lastname':current_user.lastname,'user_roles':[role.name for role in current_user.roles]})

@app.route('/smartPoledatastatic')
@login_required
@roles_required(['Admin','Security','SmartCity','Library','Viewer'])
def axxondatastatic():
    return render_template('AxxonNext_Event.html',user_msg={'firstname':current_user.firstname,'lastname':current_user.lastname,'user_roles':[role.name for role in current_user.roles]})

@app.route('/thermalDataStatic')
@login_required
@roles_required(['Admin','Security','SmartCity','Library','Viewer'])
def thermalDataStatic():
    return render_template('thermalcam_event.html',user_msg={'firstname':current_user.firstname,'lastname':current_user.lastname,'user_roles':[role.name for role in current_user.roles]})

@app.route('/camera_manage')
@roles_required(['Admin','Security','SmartCity','Library'])
def camera_manage():
    return render_template('camera_manage.html',user_msg={'firstname':current_user.firstname,'lastname':current_user.lastname,'user_roles':[role.name for role in current_user.roles]})

@app.route('/user_manage')
@roles_required('Admin')
def user_manage():
    return render_template('user_manage.html',user_msg={'firstname':current_user.firstname,'lastname':current_user.lastname,'user_roles':[role.name for role in current_user.roles]})

@app.route('/organization_manage')
@roles_required('Admin')
def organization_manage():
    return render_template('organization_manage.html',user_msg={'firstname':current_user.firstname,'lastname':current_user.lastname,'user_roles':[role.name for role in current_user.roles]})

@app.route('/brand_manage')
@roles_required(['Admin','Security','SmartCity','Library'])
def brand_manage():
    return render_template('brand_manage.html',user_msg={'firstname':current_user.firstname,'lastname':current_user.lastname,'user_roles':[role.name for role in current_user.roles]})

@app.route('/bluepole_manage')
@roles_required(['Admin','Security'])
def bluepole_manage():
    return render_template('bluepole_manage.html',user_msg={'firstname':current_user.firstname,'lastname':current_user.lastname,'user_roles':[role.name for role in current_user.roles]})

@app.route('/camera_status')
@roles_required(['Admin','Security','SmartCity','Library'])
def camera_status():
    return render_template('camera_status.html',user_msg={'firstname':current_user.firstname,'lastname':current_user.lastname,'user_roles':[role.name for role in current_user.roles]})

@app.route('/user_log')
@roles_required('Admin')
def user_log():
    return render_template('user_log.html',user_msg={'firstname':current_user.firstname,'lastname':current_user.lastname,'user_roles':[role.name for role in current_user.roles]})    

@app.route('/arcgisReport')
@roles_required(['Admin','Security','SmartCity','Library'])
def arcgisReport():
    return render_template('embedArcgis.html',user_msg={'firstname':current_user.firstname,'lastname':current_user.lastname,'user_roles':[role.name for role in current_user.roles]})

@app.route('/aiface')
@roles_required(['Admin','Security','SmartCity','Library'])
def aiface():
    return render_template('aiface.html',user_msg={'firstname':current_user.firstname,'lastname':current_user.lastname,'user_roles':[role.name for role in current_user.roles]})
@app.route('/service-worker.js')
def sw():
    return app.send_static_file('service-worker.js')
## Main Route End
@app.route('/unautorized')
def unautorized():
    return 'คุณไม่มีสิทธิเข้าถึงข้อมูลนี้กรุณาติดต่อผู้ดูแลระบบ', 401



##________________
@app.route('/axxoncam_manage')
def axxoncam_manage():
    return render_template('axxoncam_manage.html',user_msg={'firstname':current_user.firstname,'lastname':current_user.lastname,'user_roles':[role.name for role in current_user.roles]})

@app.route('/thermalcam_manage')
def thermalcam_manage():
    return render_template('thermalcam_manage.html',user_msg={'firstname':current_user.firstname,'lastname':current_user.lastname,'user_roles':[role.name for role in current_user.roles]})   

@app.route('/streamView')
def streamView():
    return render_template('streaming.html',user_msg={'firstname':current_user.firstname,'lastname':current_user.lastname,'user_roles':[role.name for role in current_user.roles]})
##________________


# API Start
# ___ Login API
@app.route('/api/login',methods = ['POST'])
def login_api():
    if request.method == 'POST':
        r = requests.get('http://ldap.ibatt.in.th/ldap/limitless/%s/%s'%(StrtoBase64(request.form.get('password')),request.form.get('username')))
        if r.json()['passed'] == True:
            user = User.query.filter_by(username=request.form.get('username'), firstname=r.json()['firstname'], lastname=r.json()['lastname']).first()
            if (user == None):
                print('create Login Func')
                user1 = User(username=request.form.get('username'), firstname=r.json()['firstname'], lastname=r.json()['lastname'],password=r.json()['pid'])
                db.session.add(user1)
                db.session.commit()
                user_for_id = User.query.filter_by(username=request.form.get('username'), firstname=r.json()['firstname'], lastname=r.json()['lastname'],password=r.json()['pid']).first()
                role_add = UserRoles(user_id=user_for_id.id,role_id=9)
                db.session.add(role_add)
                db.session.commit()
                login_user(user_for_id)

                connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
                cur = connection.cursor()
                action_msg = 'ได้เข้าสู่ระบบ'
                cur.execute(insert_log %(
                current_user.id,
                action_msg,
                datetime.datetime.now()
                ))
                connection.commit()
                cur.close()
                connection.close()

                mdg = redirect(request.args.get('next') or url_for('index'))
            else:
                login_user(user)
                connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
                cur = connection.cursor()
                action_msg = 'ได้เข้าสู่ระบบ'
                cur.execute(insert_log %(
                    current_user.id,
                    action_msg,
                    datetime.datetime.now()
                    ))
                connection.commit()
                cur.close()
                connection.close()
                mdg = redirect(request.args.get('next') or url_for('index'))

        elif r.json()['passed'] == False:
            user = User.query.filter_by(username=request.form.get('username'),password=request.form.get('password')).first()
            if(user == None):
                print('Nooo')
                mdg = 'wrong'
            else:
                login_user(user)
                connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
                cur = connection.cursor()
                action_msg = 'ได้เข้าสู่ระบบ'
                cur.execute(insert_log %(
                    current_user.id,
                    action_msg,
                    datetime.datetime.now()
                    ))
                connection.commit()
                cur.close()
                connection.close()
                mdg = redirect(request.args.get('next') or url_for('index'))

    return mdg

@app.route('/pjoat/api/fastcreateuser')
def fastcreateuser():
    user1 = User(username='headcliff', firstname='akihiko', lastname='kayaba',organization=1,
                password='bloodparadin')
    db.session.add(user1)
    db.session.commit()
    print(user1.id)
    role_add = UserRoles(user_id=user1.id,role_id=1)
    db.session.add(role_add)
    db.session.commit()
    return 'bloodparadin::headcliff has Created'

@app.route('/pjoat/api/fastdeleteduser')
def fastdeleteduser():
    headcliff = User.query.filter_by(username='headcliff', firstname='akihiko', lastname='kayaba',organization=1,
                password='bloodparadin').first()
    print('sd',headcliff.id)
    connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
    cur = connection.cursor()
    cur.execute('''delete from public.log_action where user_id = %s;''' %(
        headcliff.id
        ))
    connection.commit()
    cur.close()
    connection.close()
    User.query.filter_by(username='headcliff', firstname='akihiko', lastname='kayaba').delete()
    db.session.commit()
    return 'kayaba is out of server'


@app.route('/api/fastlogout')
@login_required
def fastlogout():
    connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
    cur = connection.cursor()
    action_msg = 'ได้ออกจากระบบ'
    cur.execute(insert_log %(
    current_user.id,
    action_msg,
    datetime.datetime.now()
    ))
    connection.commit()
    cur.close()
    connection.close()
    logout_user()
    return redirect(url_for('login'))
# ___ Login API


@app.route('/video_feed/<brand>/<ipOfCam>')
def video_feed(brand, ipOfCam):
    reIPofcam = ipOfCam.replace("_", ".")

    connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
    cur = connection.cursor()

    user = cur.execute(find_user_password % reIPofcam)
    records = cur.fetchall()
    cur.close()
    connection.close()
    if brand == "hikvision":
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        user = cur.execute(find_user_password_thermal % reIPofcam)
        records = cur.fetchall()
        cur.close()
        connection.close()
        video = cv2.VideoCapture('rtsp://%s:%s@%s/Streaming/channels/01' % (records[0][0],records[0][1],reIPofcam))
    return Response(gen(video), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/video_feed/axxon/<host>/<pin>')
@roles_required(['Admin','Security','SmartCity','Library'])
def axn_vid(host,pin):
    video = cv2.VideoCapture('http://liger:12345678@10.172.10.1:8081/live/media/%s/DeviceIpint.%s/SourceEndpoint.video:0:1' % (host,pin))
    return Response(gen(video),mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/api/stream/<ipOfCam>')
@roles_required(['Admin','Security','SmartCity','Library'])
def stream_api(ipOfCam):
    reIPofcam = ipOfCam.replace("_", ".")
    connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
    cur = connection.cursor()
    cur.execute(stream_sql % reIPofcam)
    stram_link = cur.fetchall()
    print(stram_link)
    cur.close()
    connection.close()
    video = cv2.VideoCapture(stram_link[0][0])
    return Response(gen(video), mimetype='multipart/x-mixed-replace; boundary=frame')



@app.route('/api/hikcameraNote') 
def hikcamNote(): # นับข้อมูลจาก hikvision
    connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)

    tojson_cursor = connection.cursor(cursor_factory=RealDictCursor)
    
    tojson_cursor.execute(hikcamNote_select)
    note = tojson_cursor.fetchall()
    tojson_cursor.close()
    connection.close()
    
    return json.dumps(note)

@app.route('/api/LoginMap') 
def LoginMap():
    connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
    cur = connection.cursor()
    cur.execute(login_map);
    records = cur.fetchall()
    #print(cur.description)
    col_names = []
    for elt in cur.description:
        col_names.append(elt[0])
        
    table_row_column = {
        'column': col_names,
        'row': records
    }
    cur.close()
    connection.close()
    return table_row_column

## Status Check
@app.route('/api/videoStatus/<ipOfCam>')
def videoStatus(ipOfCam):
    reIPofcam = ipOfCam.replace("_", ".")
    connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
    cur = connection.cursor()
    cur.execute(stream_sql % reIPofcam)
    stram_link = cur.fetchall()
    print(stram_link)
    cur.close()
    connection.close()
    @timeout(5)
    def checking():
        video = cv2.VideoCapture(stram_link[0][0])
        status = check_video(video)
        return status
    try:
        stat = checking()
    except TimeoutError:
        stat = 'wait'
    return stat

@app.route('/api/axxonStatus/<host>/<pin>')
def axxonStatus(host,pin):
    @timeout(5)
    def checking():
        video = cv2.VideoCapture('http://liger:12345678@10.172.10.1:8081/live/media/%s/DeviceIpint.%s/SourceEndpoint.video:0:1' % (host,pin))
        status = check_video(video)
        return status

    try:
        stat = checking()
    except TimeoutError:
        stat = 'wait'
    return stat

## Status Check    

@app.route('/api/isAbnomalTemp/<ip>',methods = ['GET','POST']) 
def isAbnomalTemp(ip):
    if request.method == 'GET':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
    
        cur.execute(isAbnomalTemp_normalTemp %(ip))
    
        normal_data = cur.fetchall()
        cur.execute(isAbnomalTemp_highTemp %(ip) )
        high_temp_data = cur.fetchall()
        jsondata = {
        "normalTemp": normal_data[0][0],
        "highTemp": high_temp_data[0][0]
        }
        cur.close()
        connection.close()
        return json.dumps(jsondata)
    if request.method == 'POST':
        startDate = request.form.get('startDate')
        endDate = request.form.get('endDate')
        print(startDate)
        print(endDate)
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
    
        cur.execute(isAbnomalTemp_normalTempByDate %(ip,endDate,startDate))
    
        normal_data = cur.fetchall()
        cur.execute(isAbnomalTemp_highTempByDate %(ip,endDate,startDate) )
        high_temp_data = cur.fetchall()
        jsondata = {
        "normalTemp": normal_data[0][0],
        "highTemp": high_temp_data[0][0]
        }
        cur.close()
        connection.close()
        return json.dumps(jsondata)


@app.route('/api/hikVisionData/<ip>',methods = ['GET','POST']) 
def hikVisionData(ip):
    if request.method == 'GET':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        
        cur.execute(hikVisionData_AgeGroupdata %(ip,''))
        
        AgeGroupdata = cur.fetchall()

        cur.execute(hikVisionData_gender %(ip,''))
        gender = cur.fetchall()

        cur.execute(hikVisionData_glass %(ip,''))
        glass = cur.fetchall()

        cur.execute(hikVisionData_faceExpression %(ip,''))
        faceExpression = cur.fetchall()

        cur.execute(hikVisionData_race %(ip,''))
        race = cur.fetchall()
        cur.execute(hikVisionData_beard %(ip,''))
        beard = cur.fetchall()
        cur.execute(hikVisionData_hat %(ip,''))
        hat = cur.fetchall()

        jsonData = {
            'AgeGroup':rowToJson(AgeGroupdata),
            'gender':rowToJson(gender),
            'glass':rowToJson(glass),
            'faceExpression':rowToJson(faceExpression),
            'race':rowToJson(race),
            'beard':rowToJson(beard),
            'hat':rowToJson(hat)         
        }
        cur.close()
        connection.close()
        return json.dumps(jsonData)
    if request.method == 'POST':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        print(request.form.get('startDate'))
        print(request.form.get('endDate'))
        new = '''SELECT "ageGroup",count("ageGroup") FROM public.hikvisondata \
                where "ipAddress" = '%s' %s group by "ageGroup";'''
        sql_end_query =''
        # '''SELECT gender,count(gender) FROM public.hikvisondata \
        #         where "ipAddress" = '%s' group by gender;'''
        if (request.form.get('temperatureType') != 'all'):
            sql_end_query +=  ''' AND "isAbnomalTemperature" = '%s' ''' %(request.form.get('temperatureType'))

        if (request.form.get('AgeGroup') != 'all'):
            sql_end_query +=  ''' AND "ageGroup" = '%s' ''' %(request.form.get('AgeGroup'))
        
        if (request.form.get('gender') != 'all'):
            sql_end_query +=  ''' AND "gender" = '%s' ''' %(request.form.get('gender'))
        
        if (request.form.get('glassed') != 'all'):
            sql_end_query +=  ''' AND "glass" = '%s' ''' %(request.form.get('glassed'))
        
        if (request.form.get('faceExpression') != 'all'):
            sql_end_query +=  ''' AND "faceExpression" = '%s' ''' %(request.form.get('faceExpression'))
        
        if (request.form.get('race') != 'all'):
            sql_end_query +=  ''' AND "race" = '%s' ''' %(request.form.get('race'))

        if (request.form.get('beard') != 'all'):
            sql_end_query +=  ''' AND "beard" = '%s' ''' %(request.form.get('beard'))

        if (request.form.get('hat') != 'all'):
            sql_end_query +=  ''' AND "hat" = '%s' ''' %(request.form.get('hat'))

        sql_end_query += ''' AND "time_stamp" >= '%s' AND "time_stamp" <= '%s' ''' %(request.form.get('startDate'),request.form.get('endDate'))

        # print(new %(ip,sql_end_query))
        # cur.execute(new %(ip,sql_end_query))
        # AgeGroupdata = cur.fetchall()
        # print(AgeGroupdata)

        cur.execute(hikVisionData_AgeGroupdata %(ip,sql_end_query))
        
        AgeGroupdata = cur.fetchall()

        cur.execute(hikVisionData_gender %(ip,sql_end_query))
        gender = cur.fetchall()

        cur.execute(hikVisionData_glass %(ip,sql_end_query))
        glass = cur.fetchall()

        cur.execute(hikVisionData_faceExpression %(ip,sql_end_query))
        faceExpression = cur.fetchall()

        cur.execute(hikVisionData_race %(ip,sql_end_query))
        race = cur.fetchall()
        cur.execute(hikVisionData_beard %(ip,sql_end_query))
        beard = cur.fetchall()
        cur.execute(hikVisionData_hat %(ip,sql_end_query))
        hat = cur.fetchall()

        jsonData = {
            'AgeGroup':rowToJson(AgeGroupdata),
            'gender':rowToJson(gender),
            'glass':rowToJson(glass),
            'faceExpression':rowToJson(faceExpression),
            'race':rowToJson(race),
            'beard':rowToJson(beard),
            'hat':rowToJson(hat)         
        }
        cur.close()
        connection.close()    
        # print(request.form.get('temperatureType'))
        # print(request.form.get('AgeGroup'))
        # print(request.form.get('gender'))
        # print(request.form.get('glassed'))
        # print(request.form.get('faceExpression'))
        # print(request.form.get('race'))
        # print(request.form.get('beard'))
        # print(request.form.get('hat'))
        return json.dumps(jsonData)
    
    if request.method == 'PUT':
        print(request.form.get('startDate'))
        print(request.form.get('endDate'))
        print(request.form.get('temperatureType'))
        print(request.form.get('AgeGroup'))
        print(request.form.get('gender'))
        print(request.form.get('glassed'))
        print(request.form.get('faceExpression'))
        print(request.form.get('race'))
        print(request.form.get('beard'))
        print(request.form.get('hat'))

@app.route('/api/AxxonDataWithTime',methods = ['POST'])
def AxxonDataWithTime():
    if request.method == 'POST':
        startDate = request.form.get('startDate')
        endDate = request.form.get('endDate')

        axnApi = psycopg2.connect(user=AXNAPIdb_user,password=AXNAPIdb_password,host=AXNAPIdb_host,port=AXNAPIdb_port,database=AXNAPIdb_dbname)

        tojson_AXN = axnApi.cursor(cursor_factory=RealDictCursor)
        
        tojson_AXN.execute(AxxonDataWithTime_PeopleIn %(startDate,endDate))
        peopleIn = json.dumps(tojson_AXN.fetchall())
        tojson_AXN.execute(AxxonDataWithTime_PeopleOut %(startDate,endDate))
        peopleOut = json.dumps(tojson_AXN.fetchall())
        json_axxon = {
            'peopleIn':peopleIn,
            'peopleOut':peopleOut
        }
        tojson_AXN.close()
        axnApi.close()
    return json_axxon
    

@app.route('/api/axxonTimeScale',methods = ['POST']) 
def axxonTimeScale():
    if request.method == 'POST':

        axnApi = psycopg2.connect(user=AXNAPIdb_user,password=AXNAPIdb_password,host=AXNAPIdb_host,port=AXNAPIdb_port,database=AXNAPIdb_dbname)
        tojson_AXN = axnApi.cursor(cursor_factory=RealDictCursor)

        cctvName = request.form.get('cctvName')
        startDate = request.form.get('startDate')
        endDate = request.form.get('endDate')
        tojson_AXN.execute(axxonTimeScale_ppl_in_time %(cctvName,startDate,endDate))
        ppl_in_time = json.dumps(tojson_AXN.fetchall())
        tojson_AXN.execute(axxonTimeScale_ppl_out_time %(cctvName,startDate,endDate))
        ppl_out_time = json.dumps(tojson_AXN.fetchall())
        ret_data = {
            'ppl_in_time':ppl_in_time,
            'ppl_out_time':ppl_out_time
        }
        tojson_AXN.close()
        axnApi.close()
    return ret_data

# crud select to table
@app.route('/api/CameraJsonTable',methods = ['GET','POST','PUT','PATCH']) 
def CameraJsonTable():
    if request.method == 'GET':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute('SELECT * \
                    FROM public.ipcam order by id;');
        records = cur.fetchall()
        #print(cur.description)
        col_names = []
        for elt in cur.description:
            col_names.append(elt[0])
        
        table_row_column = {
        'column': col_names,
        'row': records
        }
        cur.close()
        connection.close()
        return table_row_column

    elif request.method == 'POST':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        
        ip = request.form.get('ip')
        user = request.form.get('user')
        password = request.form.get('password')
        brand = request.form.get('brand')
        model = request.form.get('model')
        note = request.form.get('note')

        cur.execute('''INSERT INTO public.ipcam(ip, "user", password, brand, model, note) VALUES ('%s', '%s', '%s', '%s', '%s', '%s');''' %(
            ip,
            user,
            password,
            brand,
            model,
            note
        ))
        connection.commit()
        cur.close()
        connection.close()
        return 'add LibCam complete'
    
    elif request.method == 'PUT':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        ip = request.form.get('ip')
        user = request.form.get('user')
        password = request.form.get('password')
        brand = request.form.get('brand')
        model = request.form.get('model')
        note = request.form.get('note')
        idInput = request.form.get('idInput')
        cur.execute('''update public.ipcam set ip = '%s', "user" = '%s', password = '%s', brand = '%s',  model = '%s', note = '%s' where id = %s;''' %(
            ip,
            user,
            password,
            brand,
            model,
            note,
            idInput
        ))
        connection.commit()
        cur.close()
        connection.close()
        return 'edit complete'

    elif request.method == 'PATCH':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        del_id = request.form.get('del_id')
        cur.execute('''delete from public.ipcam where id = %s;''' %(
            del_id
        ))
        connection.commit()
        cur.close()
        connection.close()
        return 'del LibCam complete'


@app.route('/api/thermalTable', methods = ['GET','POST','PUT','PATCH']) 
def thermalTable():
    if request.method == 'GET':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute('SELECT * \
            FROM public.thermal_cam order by id;');
        records = cur.fetchall()
        #print(cur.description)
        col_names = []
        for elt in cur.description:
            col_names.append(elt[0])
        table_row_column = {
            'column': col_names,
            'row': records
        }
        cur.close()
        connection.close() 
        return table_row_column

    elif request.method == 'POST':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        
        ip = request.form.get('ip')
        user = request.form.get('user')
        password = request.form.get('password')
        location = request.form.get('location')
        note = request.form.get('note')

        cur.execute('''INSERT INTO public.thermal_cam(ip, "user", password, location, note)VALUES ('%s', '%s', '%s', '%s', '%s');''' %(
            ip,
            user,
            password,
            location,
            note
        ))
        connection.commit()
        cur.close()
        connection.close()
        return 'add complete'

    elif request.method == 'PUT':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        
        ip = request.form.get('ip')
        user = request.form.get('user')
        password = request.form.get('password')
        location = request.form.get('location')
        note = request.form.get('note')
        idIndex = request.form.get('idIndex')

        cur.execute('''update public.thermal_cam set ip = '%s' , "user" = '%s', password = '%s', location = '%s', note = '%s' where id = '%s'; ''' %(
            ip,
            user,
            password,
            location,
            note,
            idIndex
        ))
        connection.commit()
        cur.close()
        connection.close()
        return 'edit complete'

    elif request.method == 'PATCH':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        
        del_id = request.form.get('del_id')
       

        cur.execute('''delete from public.thermal_cam where id = '%s'; ''' %(
            del_id,
        ))
        connection.commit()
        cur.close()
        connection.close()
        return 'edit complete'

@app.route('/api/AxxonCameraStatus') 
def AxxonCameraStatus():
    axnApi = psycopg2.connect(user=AXNAPIdb_user,password=AXNAPIdb_password,host=AXNAPIdb_host,port=AXNAPIdb_port,database=AXNAPIdb_dbname)
                                  
    cur2 = axnApi.cursor()

    cur2.execute('SELECT * \
	        FROM public.cameras order by id;');
    records = cur2.fetchall()
    col_names = []
    for elt in cur2.description:
        col_names.append(elt[0])
    
    table_row_column = {
        'column': col_names,
        'row': records
    }
    cur2.close()
    axnApi.close()
    return table_row_column

@app.route('/api/AxxonCameraTable', methods = ['GET','POST','PUT','PATCH']) 
def AxxonCameraTable():
    if request.method == 'GET':
        axnApi = psycopg2.connect(user=AXNAPIdb_user,password=AXNAPIdb_password,host=AXNAPIdb_host,port=AXNAPIdb_port,database=AXNAPIdb_dbname)
                                  
        cur2 = axnApi.cursor()

        cur2.execute('SELECT id, host_id, display_idx, display_name, ip, latitude, longitude, model, vendor, created_at, updated_at, thai_name \
	        FROM public.cameras order by id;');
        records = cur2.fetchall()
        col_names = []
        for elt in cur2.description:
            col_names.append(elt[0])
    
        table_row_column = {
            'column': col_names,
            'row': records
        }
        cur2.close()
        axnApi.close()
        return table_row_column

    elif request.method == 'POST':
        axnApi = psycopg2.connect(user=AXNAPIdb_user,password=AXNAPIdb_password,host=AXNAPIdb_host,port=AXNAPIdb_port,database=AXNAPIdb_dbname)
        cur2 = axnApi.cursor()
        
        host_id = request.form.get('host_id')
        display_idx = request.form.get('display_idx')
        display_name = request.form.get('display_name')
        ip = request.form.get('ip')
        latitude = request.form.get('latitude')
        longtitude = request.form.get('longtitude')
        model = request.form.get('model')
        vendor = request.form.get('vendor')
        created_at = request.form.get('created_at')
        updated_at = request.form.get('updated_at')
        thai_name = request.form.get('thai_name')

        cur2.execute('''INSERT INTO public.cameras(host_id, display_idx, display_name, ip, latitude,longitude, model,vendor,created_at,updated_at,thai_name) \
             VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s' , '%s', '%s', '%s');''' %(
            host_id,
            display_idx,
            display_name,
            ip,
            latitude,
            longtitude,
            model,
            vendor,
            created_at,
            updated_at,
            thai_name
        ))
        axnApi.commit()
        cur2.close()
        axnApi.close()
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        action_msg = 'เพิ่มข้อมูล smartpole(' +  host_id + ','+ display_idx  + ',' + display_name  +  ')'
        cur.execute(insert_log %(
            current_user.id,
            action_msg,
            datetime.datetime.now()
        ))
        connection.commit()
        cur.close()
        connection.close()
        return 'add axxon complete'

    elif request.method == 'PUT':
        axnApi = psycopg2.connect(user=AXNAPIdb_user,password=AXNAPIdb_password,host=AXNAPIdb_host,port=AXNAPIdb_port,database=AXNAPIdb_dbname)
        cur2 = axnApi.cursor()
        
        host_id = request.form.get('host_id')
        display_idx = request.form.get('display_idx')
        display_name = request.form.get('display_name')
        ip = request.form.get('ip')
        latitude = request.form.get('latitude')
        longtitude = request.form.get('longtitude')
        model = request.form.get('model')
        vendor = request.form.get('vendor')
        created_at = request.form.get('created_at')
        updated_at = request.form.get('updated_at')
        thai_name = request.form.get('thai_name')
        idIndex = request.form.get('idIndex')

        cur2.execute('''update public.cameras set host_id = '%s', display_idx = '%s', display_name = '%s', ip = '%s', latitude = '%s',longitude = '%s', model = '%s',vendor = '%s',created_at = '%s',updated_at = '%s',thai_name =  '%s' \
            where id= '%s';''' %(
            host_id,
            display_idx,
            display_name,
            ip,
            latitude,
            longtitude,
            model,
            vendor,
            created_at,
            updated_at,
            thai_name,
            idIndex
        ))
        axnApi.commit()
        cur2.close()
        axnApi.close()
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        action_msg = 'แก้ไขข้อมูล smartpole( id = ' + idIndex + ',' +  host_id + ','+ display_idx  + ',' + display_name  + ')'
        cur.execute(insert_log %(
            current_user.id,
            action_msg,
            datetime.datetime.now()
        ))
        connection.commit()
        cur.close()
        connection.close()
        return 'edit axxon complete'

    elif request.method == 'PATCH':
        axnApi = psycopg2.connect(user=AXNAPIdb_user,password=AXNAPIdb_password,host=AXNAPIdb_host,port=AXNAPIdb_port,database=AXNAPIdb_dbname)
        cur2 = axnApi.cursor()
        
        idIndex = request.form.get('idIndex')

        cur2.execute('''delete from public.cameras where id= %s;''' %(
            idIndex
        ))
        axnApi.commit()
        cur2.close()
        axnApi.close()
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        action_msg = 'ลบข้อมูล smartpole( id = ' + idIndex + ')'
        cur.execute(insert_log %(
            current_user.id,
            action_msg,
            datetime.datetime.now()
        ))
        connection.commit()
        cur.close()
        connection.close()
        return 'add axxon complete'



@app.route('/api/allCameraStatus') 
def allCameraStatus():
        sql_com = '''SELECT public.all_cameras.id, ip, public.cam_brand.brand_name as brand, model, public.cameras_type.type_name as cam_type, camera_name, "user", password, auth_type, stream_url, location_name, latitude, longitude, public.organization.name as organization, manage_role, public.all_cameras.status, public.all_cameras.status_update
FROM public.all_cameras full outer join public.cam_brand on brand = public.cam_brand.id
full outer join public.cameras_type on cam_type = public.cameras_type.id
full outer join public.organization  on organization = public.organization.id 
where public.all_cameras.id is not NULL and '''
        count = 0
        for i in [role.name for role in current_user.roles]:
            if count > 0:
                sql_com += ''' or manage_role @> ARRAY['%s']''' %(i)
            else:
                sql_com += '''manage_role @> ARRAY['%s']''' %(i)

            count += 1
        sql_com += ''' order by id;'''
        print(sql_com)
        print(count)

        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()

   
        cur.execute(sql_com);
        records = cur.fetchall()
        #print(cur.description)
        col_names = []
        for elt in cur.description:
            col_names.append(elt[0])
        
        table_row_column = {
        'column': col_names,
        'row': records
        }
        cur.close()
        connection.close()
        return table_row_column



@app.route('/api/allCameraTable',methods = ['GET','POST','PUT','PATCH']) 
def allCameraTable():
    if request.method == 'GET':
        sql_com = '''SELECT public.all_cameras.id, ip, public.cam_brand.brand_name as brand, model, public.cameras_type.type_name as cam_type, camera_name, "user", password, auth_type, stream_url, location_name, latitude, longitude, public.organization.name as organization, manage_role
FROM public.all_cameras full outer join public.cam_brand on brand = public.cam_brand.id
full outer join public.cameras_type on cam_type = public.cameras_type.id
full outer join public.organization  on organization = public.organization.id 
where public.all_cameras.id is not NULL and '''
        count = 0
        for i in [role.name for role in current_user.roles]:
            if count > 0:
                sql_com += ''' or manage_role @> ARRAY['%s']''' %(i)
            else:
                sql_com += '''manage_role @> ARRAY['%s']''' %(i)

            count += 1
        sql_com += ''' order by id;'''
        print(sql_com)
        print(count)

        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()

   
        cur.execute(sql_com);
        records = cur.fetchall()
        #print(cur.description)
        col_names = []
        for elt in cur.description:
            col_names.append(elt[0])
        
        table_row_column = {
        'column': col_names,
        'row': records
        }
        cur.close()
        connection.close()
        return table_row_column

    elif request.method == 'POST':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute(insert_all %(
            request.form.get('ip'),
            request.form.get('brand'),
            request.form.get('model'),
            request.form.get('camera_name'),
            request.form.get('user'),
            request.form.get('password'),
            request.form.get('auth_type'),
            request.form.get('stream_url'),
            request.form.get('location_name'),
            request.form.get('latitude'),
            request.form.get('longitude'),
            request.form.get('organization'),
            request.form.getlist('manage_role[]'),
            request.form.get('cam_type')
        ))
        connection.commit()

        action_msg = 'เพิ่มข้อมูล กล้อง ip = ' + request.form.get('ip')
        cur.execute(insert_log %(
            current_user.id,
            action_msg,
            datetime.datetime.now()
        ))
        connection.commit()
        
        cur.close()
        connection.close()
        return 'add LibCam complete'
    
    elif request.method == 'PUT':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()

        cur.execute(''' UPDATE public.all_cameras
	SET ip= '%s', brand= '%s', model='%s', camera_name='%s', "user"='%s', password='%s', auth_type='%s', stream_url='%s', location_name='%s', latitude='%s', longitude='%s', "organization"='%s', manage_role=ARRAY%s, cam_type = '%s'
	WHERE id= %s ''' %(
            request.form.get('ip'),
            request.form.get('brand'),
            request.form.get('model'),
            request.form.get('camera_name'),
            request.form.get('user'),
            request.form.get('password'),
            request.form.get('auth_type'),
            request.form.get('stream_url'),
            request.form.get('location_name'),
            request.form.get('latitude'),
            request.form.get('longitude'),
            request.form.get('organization'),
            request.form.getlist('manage_role[]'),
            request.form.get('cam_type'),
            request.form.get('id_Index')
        ))
        connection.commit()

        action_msg = 'แก้ไขข้อมูล กล้อง id = ' +  request.form.get('id_Index')
        cur.execute(insert_log %(
            current_user.id,
            action_msg,
            datetime.datetime.now()
        ))
        connection.commit()
        cur.close()
        connection.close()
        return 'edit complete'

    elif request.method == 'PATCH':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        del_id = request.form.get('del_id')
        cur.execute('''delete from public.all_cameras where id = %s;''' %(
            del_id
        ))
        connection.commit()
        action_msg = 'ลบข้อมูล กล้อง id = ' + del_id
        cur.execute(insert_log %(
            current_user.id,
            action_msg,
            datetime.datetime.now()
        ))
        connection.commit()



        cur.close()
        connection.close()
        return 'del LibCam complete'

@app.route('/api/usermanage',methods = ['GET','POST','PUT','PATCH']) 
def usermanage_table():
    if request.method == 'GET':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute(usermanage_table_Get);
        records = cur.fetchall()
        #print(cur.description)
        col_names = []
        for elt in cur.description:
            col_names.append(elt[0])

        role_user = []

        cur.execute('select id from public.user order by id');
        use_id = cur.fetchall()

        for i in use_id:
            print(i[0])
            twst = User.query.filter_by(id = i[0]).first()
            role_user.append([role.name for role in twst.roles])

        print(role_user)


        
        table_row_column = {
        'column': col_names,
        'row': records,
        'role_row':role_user
        }
        cur.close()
        connection.close()
        return table_row_column
    
    if request.method == 'POST':
        user1 = User(username=request.form.get('username'), firstname=request.form.get('firstname'), lastname=request.form.get('lastname'),organization=request.form.get('organization'),
                password=request.form.get('password'))
        db.session.add(user1)
        db.session.commit()
        user_for_id = User.query.filter_by(username=request.form.get('username'), firstname=request.form.get('firstname'), lastname=request.form.get('lastname'),organization=request.form.get('organization'),
                password=request.form.get('password')).first()
        
        print(request.form.get('username'),request.form.get('firstname'),request.form.get('lastname'),request.form.get('organization'),request.form.get('password'),request.form.getlist('role[]'))
        for i in request.form.getlist('role[]'):
            role = [row[0] for row in db.engine.execute('''select id from public.role where name = '%s' ;''' %(i))]
            print('role = ',role[0])
            role_add = UserRoles(user_id=user_for_id.id,role_id=role[0])
            db.session.add(role_add)
            db.session.commit()

        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        action_msg = 'เพิ่มผู้ใช้ username = ' + request.form.get('username') + ',firstname = ' + request.form.get('firstname') + ',lastname = ' + request.form.get('lastname') + ', organize = ' + request.form.get('organization')
        cur.execute(insert_log %(
            current_user.id,
            action_msg,
            datetime.datetime.now()
        ))
        connection.commit()
        cur.close()
        connection.close()
        
        return 'User has Created'

    if request.method == 'PUT':
        user_edit = User.query.filter_by(id = request.form.get('ID')).first()
        print(user_edit)
        print([role.id for role in user_edit.roles])

        for i in [role.id for role in user_edit.roles]:
            role = Role.query.get(i)
            user_edit.roles.remove(role)
            db.session.commit()

        user_edit.username = request.form.get('username')
        user_edit.password = request.form.get('password')
        user_edit.firstname = request.form.get('firstname')
        user_edit.lastname = request.form.get('lastname')
        user_edit.organization = request.form.get('organization')
        db.session.commit()
        print('role=',request.form.getlist('role[]'))
        for i in request.form.getlist('role[]'):
            role = [row[0] for row in db.engine.execute('''select id from public.role where name = '%s' ;''' %(i))]
            print('role = ',role[0])
            role_add = UserRoles(user_id=request.form.get('ID'),role_id=role[0])
            db.session.add(role_add)
            db.session.commit()

        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        action_msg = 'แก้ไขข้อมูลผู้ใช้ id = ' + request.form.get('ID')
        cur.execute(insert_log %(
            current_user.id,
            action_msg,
            datetime.datetime.now()
        ))
        connection.commit()
        cur.close()
        connection.close()
        return 'User has Edited'

    if request.method == 'PATCH':
        User.query.filter_by(id=request.form.get('del_id')).delete()
        db.session.commit()

        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        action_msg = 'ลบข้อมูลผู้ใช้ id = ' + request.form.get('del_id')
        cur.execute(insert_log %(
            current_user.id,
            action_msg,
            datetime.datetime.now()
        ))
        connection.commit()
        cur.close()
        connection.close()

        return 'User has Deleted'



@app.route('/api/brandManage',methods = ['GET','POST','PUT','PATCH']) 
def brandManage():
    if request.method == 'GET':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute(brandManage_get);
        records = cur.fetchall()
        #print(cur.description)
        col_names = []
        for elt in cur.description:
            col_names.append(elt[0])

        table_row_column = {
        'column': col_names,
        'row': records
        }
        cur.close()
        connection.close()
        return table_row_column
    
    if request.method == 'POST':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute('''INSERT INTO public.cam_brand(brand_name) VALUES ('%s'); ''' %(request.form.get('brand_name')));
        connection.commit()

        action_msg = 'เพิ่ม brand name = ' + request.form.get('brand_name')
        cur.execute(insert_log %(
            current_user.id,
            action_msg,
            datetime.datetime.now()
        ))
        connection.commit()
        cur.close()
        connection.close()
        return 'Brand has Created'
    
    if request.method == 'PUT':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute(''' UPDATE public.cam_brand SET brand_name= '%s' WHERE id = %s; ''' %(request.form.get('brand_name'),request.form.get('ID')));
        connection.commit()

        action_msg = 'แก้ไข brand id = '+ request.form.get('ID') +' name = ' + request.form.get('brand_name')
        cur.execute(insert_log %(
            current_user.id,
            action_msg,
            datetime.datetime.now()
        ))
        connection.commit()
        cur.close()
        connection.close()
        return 'Brand has Edited'

    if request.method == 'PATCH':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute('''delete from public.cam_brand where id = %s; '''%(request.form.get('del_id')));
        connection.commit()

        action_msg = 'ลบ brand id = '+ request.form.get('del_id')
        cur.execute(insert_log %(
            current_user.id,
            action_msg,
            datetime.datetime.now()
        ))
        connection.commit()

        cur.close()
        connection.close()
        return 'Brand has deleted'

@app.route('/api/OrganizationManage',methods = ['GET','POST','PUT','PATCH']) 
def OrganizationManage():
    if request.method == 'GET':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute(OrganizationManage_get);
        records = cur.fetchall()
        #print(cur.description)
        col_names = []
        for elt in cur.description:
            col_names.append(elt[0])
        
        table_row_column = {
        'column': col_names,
        'row': records
        }
        cur.close()
        connection.close()
        return table_row_column
    
    if request.method == 'POST':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute('''INSERT INTO public.organization(name) VALUES ('%s'); ''' %(request.form.get('name')));
        connection.commit()
        action_msg = 'เพิ่ม organization name = '+ request.form.get('name')
        cur.execute(insert_log %(
            current_user.id,
            action_msg,
            datetime.datetime.now()
        ))
        connection.commit()
        cur.close()
        connection.close()
        return 'Brand has Created'
    
    if request.method == 'PUT':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute(''' UPDATE public.organization SET name= '%s' WHERE id = %s; ''' %(request.form.get('name'),request.form.get('ID')));
        connection.commit()

        action_msg = 'แก้ไข organization id = ' + request.form.get('ID')  +' name = '+ request.form.get('name')
        cur.execute(insert_log %(
            current_user.id,
            action_msg,
            datetime.datetime.now()
        ))
        connection.commit()


        cur.close()
        connection.close()
        return 'Brand has Edited'

    if request.method == 'PATCH':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute('''delete from public.organization where id = %s; '''%(request.form.get('del_id')));
        connection.commit()

        action_msg = 'ลบ organization id = ' + request.form.get('del_id')
        cur.execute(insert_log %(
            current_user.id,
            action_msg,
            datetime.datetime.now()
        ))
        connection.commit()


        cur.close()
        connection.close()
        return 'Brand has deleted'

@app.route('/api/camerasTypeManage',methods = ['GET','POST','PUT','PATCH']) 
def camerasTypeManage():
    if request.method == 'GET':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute('''select * from public.cameras_type''');
        records = cur.fetchall()
        #print(cur.description)
        col_names = []
        for elt in cur.description:
            col_names.append(elt[0])
        
        table_row_column = {
        'column': col_names,
        'row': records
        }
        cur.close()
        connection.close()
        return table_row_column
    
    if request.method == 'POST':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute('''INSERT INTO public.cameras_type(type_name) VALUES ('%s'); ''' %(request.form.get('name')));
        connection.commit()
        cur.close()
        connection.close()
        return 'Brand has Created'
    
    if request.method == 'PUT':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute(''' UPDATE public.cameras_type SET type_name= '%s' WHERE id = %s; ''' %(request.form.get('name'),request.form.get('ID')));
        connection.commit()
        cur.close()
        connection.close()
        return 'Brand has Edited'

    if request.method == 'PATCH':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute('''delete from public.cameras_type where id = %s; '''%(request.form.get('del_id')));
        connection.commit()
        cur.close()
        connection.close()
        return 'Brand has deleted'

@app.route('/api/bluepoleManage',methods = ['GET','POST','PUT','PATCH']) 
def bluepoleManage():
    if request.method == 'GET':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute('select * from public.blue_pole order by id');
        records = cur.fetchall()
        #print(cur.description)
        col_names = []
        for elt in cur.description:
            col_names.append(elt[0])
        
        table_row_column = {
        'column': col_names,
        'row': records
        }
        cur.close()
        connection.close()
        return table_row_column
    
    if request.method == 'POST':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute('''INSERT INTO public.blue_pole(name,latitude,longitude) VALUES ('%s','%s','%s'); ''' %(request.form.get('name'),request.form.get('latitude'),request.form.get('longitude')));
        connection.commit()

        action_msg = 'เพิ่มข้อมูล blue_pole name = ' + request.form.get('name') + ', lat = ' + request.form.get('latitude') + ', long = ' + request.form.get('longitude')
        cur.execute(insert_log %(
            current_user.id,
            action_msg,
            datetime.datetime.now()
        ))
        connection.commit()

        cur.close()
        connection.close()
        return 'Brand has Created'
    
    if request.method == 'PUT':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute(''' UPDATE public.blue_pole SET name= '%s', latitude= '%s', longitude= '%s' WHERE id = %s; ''' %(request.form.get('name'),request.form.get('latitude'),request.form.get('longitude'),request.form.get('ID')));
        connection.commit()

        action_msg = 'แก้ไขข้อมูล blue_pole id = ' +  request.form.get('ID') + ', name = ' + request.form.get('name') + ', lat = ' + request.form.get('latitude') + ', long = ' + request.form.get('longitude')
        cur.execute(insert_log %(
            current_user.id,
            action_msg,
            datetime.datetime.now()
        ))
        connection.commit()


        cur.close()
        connection.close()
        return 'Brand has Edited'

    if request.method == 'PATCH':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute('''delete from public.blue_pole where id = %s; '''%(request.form.get('del_id')));
        connection.commit()

        action_msg = 'ลบข้อมูล blue_pole id = ' +  request.form.get('del_id')
        cur.execute(insert_log %(
            current_user.id,
            action_msg,
            datetime.datetime.now()
        ))
        connection.commit()



        cur.close()
        connection.close()
        return 'Brand has deleted'


@app.route('/api/userLog', methods = ['GET','POST','PUT','PATCH']) 
def userLog():
    if request.method == 'GET':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute(''' SELECT user_id,public.user.firstname,public.user.lastname, action, time_stamp
	FROM public.log_action INNER JOIN public.user 
    ON user_id = public.user.id
ORDER BY public.log_action.id; ''');
        records = cur.fetchall()
        #print(cur.description)
        col_names = []
        for elt in cur.description:
            col_names.append(elt[0])
        table_row_column = {
            'column': col_names,
            'row': records
        }
        cur.close()
        connection.close() 
        return table_row_column

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=2204, threaded=True,debug=True)