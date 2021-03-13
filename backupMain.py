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


app = Flask(__name__, static_folder='static')

# *** DB Set Up ***
#---------SmartSafety DB ------------#
smartsafty_user = "postgres"
smartsafty_password ="123456789o"
smartsafty_host = "127.0.0.1"
smartsafty_port = "5432"
smartsafty_dbname = "SmartSafety"
### SQLAlchemy Config ####

class ConfigClass(object):
    SQLALCHEMY_DATABASE_URI = 'postgresql://' + smartsafty_user + ':' + smartsafty_password + '@' + smartsafty_host + ':' + smartsafty_port +'/' + smartsafty_dbname
    SECRET_KEY = 'thisissecret'
    USER_LOGIN_URL = '/login'
    USER_LOGIN_TEMPLATE = 'Login.html'




app.config.from_object(__name__+'.ConfigClass')
db = SQLAlchemy(app)
#---------SmartSafety DB ------------#

#---------AXNAPI DB ------------#
AXNAPIdb_user = "AXNAPI"
AXNAPIdb_password = "AXNAPI"
AXNAPIdb_host = "127.0.0.1"
AXNAPIdb_port = "5432"
AXNAPIdb_dbname = "AXNAPI"
#---------AXNAPI DB ------------#

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True)
    password = db.Column(db.String(255), nullable=False, server_default='')
    firstname = db.Column(db.String(255), nullable=False, server_default='')
    lastname = db.Column(db.String(255), nullable=False, server_default='')
    affiliate = db.Column(db.Integer(), db.ForeignKey('affiliate.id', ondelete='CASCADE'))
    roles = db.relationship('Role', secondary='user_roles',backref=db.backref('users', lazy='dynamic'))

class Role(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(50), unique=True)

class UserRoles(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id', ondelete='CASCADE'))
    role_id = db.Column(db.Integer(), db.ForeignKey('role.id', ondelete='CASCADE'))

class Affiliate(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(255), unique=True)

class CustomUserManager(UserManager):

    # Override or extend the default login view method
    def login_view(self):
        return redirect(url_for('login'))
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
        ret, jpeg = cv2.imencode('.jpg', image)
        frame = jpeg.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')



@app.route('/')
@login_required
def index():
    return render_template('Dashboard.html')


@app.route('/logins')
def login():
    return render_template('Login.html')


@app.route('/carcounting')
def carcounting():
    return render_template('CarCounting.html')

@app.route('/maps')
def maps():
    return render_template('Maps.html')

@app.route('/PeopleCount')
def PeopleCoun():
    return render_template('PeopleCoun.html')

@app.route('/thermal')
def thermal():
    return render_template('Thermal.html')

@app.route('/axxondatastatic')
def axxondatastatic():
    return render_template('AxxonNext_Event.html')

@app.route('/thermalDataStatic')
def thermalDataStatic():
    return render_template('thermalcam_event.html')
    
@app.route('/camera_manage')
@roles_required('Admin')
def camera_manage():
    return render_template('camera_manage.html')

@app.route('/axxoncam_manage')
def axxoncam_manage():
    return render_template('axxoncam_manage.html')

@app.route('/thermalcam_manage')
def thermalcam_manage():
    return render_template('thermalcam_manage.html')   

@app.route('/streamView')
def streamView():
    return render_template('streaming.html')


@app.route('/api/fastcreateuser')
def fastcreateuser():
    user1 = User(username='user_fast1', firstname='fast', lastname='user',affiliate=1,
                password=user_manager.hash_password('Password1'))
    user1.roles.append(Role(name='Admin'))
    db.session.add(user1)
    db.session.commit()
    return 'User has Created'

@app.route('/api/fastlogin')
def fastlogin():
    user = User.query.filter_by(username='user_fast1').first()
    login_user(user)
    return 'You are now logged in!'

@app.route('/api/fastlogout')
@login_required
def fastlogout():
    logout_user()
    return 'You are now logged out!'

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
def axn_vid(host,pin):
    video = cv2.VideoCapture('http://liger:12345678@10.172.10.1:8081/live/media/%s/DeviceIpint.%s/SourceEndpoint.video:0:0' % (host,pin))
    return Response(gen(video),mimetype='multipart/x-mixed-replace; boundary=frame')





@app.route('/api/hikcameraNote') 
def hikcamNote(): # นับข้อมูลจาก hikvision
    connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)

    tojson_cursor = connection.cursor(cursor_factory=RealDictCursor)
    
    tojson_cursor.execute(hikcamNote_select)
    note = tojson_cursor.fetchall()
    tojson_cursor.close()
    connection.close()
    
    return json.dumps(note)

@app.route('/api/isAbnomalTemp/<ip>') 
def isAbnomalTemp(ip):
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

@app.route('/api/hikVisionData/<ip>') 
def hikVisionData(ip):
    connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
    cur = connection.cursor()
    
    cur.execute(hikVisionData_AgeGroupdata %(ip))
    
    AgeGroupdata = cur.fetchall()

    cur.execute(hikVisionData_gender %(ip))
    gender = cur.fetchall()

    cur.execute(hikVisionData_glass %(ip))
    glass = cur.fetchall()

    cur.execute(hikVisionData_faceExpression %(ip))
    faceExpression = cur.fetchall()

    cur.execute(hikVisionData_race %(ip))
    race = cur.fetchall()
    cur.execute(hikVisionData_beard %(ip))
    beard = cur.fetchall()
    cur.execute(hikVisionData_hat %(ip))
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


@app.route('/api/AxxonCameraTable', methods = ['GET','POST','PUT','PATCH']) 
def AxxonCameraTable():
    if request.method == 'GET':
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
        return 'add axxon complete'



@app.route('/api/allCameraTable',methods = ['GET','POST','PUT','PATCH']) 
def allCameraTable():
    if request.method == 'GET':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute('SELECT * \
                    FROM public.all_cameras order by id;');
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
        

        cur.execute('''INSERT INTO public.all_cameras(
             ip, brand, model, camera_name, "user", password, auth_type, stream_url, location_name, latitude, longitude, "responsible_agency", manage_role)
            VALUES ('%s','%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s'); ''' %(
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
            request.form.get('responsible_agency'),
            request.form.get('manage_role')

        ))
        connection.commit()
        cur.close()
        connection.close()
        return 'add LibCam complete'
    
    elif request.method == 'PUT':
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()

        cur.execute(''' UPDATE public.all_cameras
	SET ip= '%s', brand= '%s', model='%s', camera_name='%s', "user"='%s', password='%s', auth_type='%s', stream_url='%s', location_name='%s', latitude='%s', longitude='%s', " responsible_agency"='%s', manage_role='%s'
	WHERE id= %s, ''' %(
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
            request.form.get('responsible_agency'),
            request.form.get('manage_role'),
            request.form.get('id_Index')
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
        cur.close()
        connection.close()
        return 'del LibCam complete'








if __name__ == '__main__':
    app.run(host='0.0.0.0', port=2204, threaded=True,debug=True)