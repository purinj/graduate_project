from flask import Flask, Response, render_template,request
import cv2
import psycopg2
import json
from psycopg2.extras import RealDictCursor


app = Flask(__name__, static_folder='static')


def dbConf():
    connection = psycopg2.connect(user="postgres",
                                  password="123456789o",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="SmartSafety")
    cur = connection.cursor()
    tojson_cursor = connection.cursor(cursor_factory=RealDictCursor)
    
    axnApi = psycopg2.connect(user="AXNAPI",
                                  password="AXNAPI",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="AXNAPI")
                                  
    cur2 = axnApi.cursor()
    tojson_AXN = axnApi.cursor(cursor_factory=RealDictCursor)
    return connection,cur,tojson_cursor,axnApi,cur2,tojson_AXN

def rowToJson(inputlist):
    text = {}
    for i in inputlist:
            text.update({i[0] : i[1]})
    
    return text


@app.route('/')
def dash():
    return render_template('Dashboard.html')

@app.route('/carcounting')
def carcounting():
    return render_template('CarCounting.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/maps')
def maps():
    return render_template('Maps.html')

@app.route('/PeopleCount')
def PeopleCoun():
    return render_template('PeopleCoun.html')

@app.route('/thermal')
def thermal():
    return render_template('Thermal.html')



@app.route('/testVid')
def index():
    return render_template('index.html')

@app.route('/axxondatastatic')
def axxondatastatic():
    return render_template('AxxonNext_Event.html')

@app.route('/thermalDataStatic')
def thermalDataStatic():
    return render_template('thermalcam_event.html')
    
@app.route('/camera_manage')
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



def gen(video):
    while True:
        success, image = video.read()
        ret, jpeg = cv2.imencode('.jpg', image)
        frame = jpeg.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route('/video_feed/<brand>/<ipOfCam>')
def video_feed(brand, ipOfCam):
    reIPofcam = ipOfCam.replace("_", ".")

    connection = psycopg2.connect(user="postgres",
                                  password="123456789o",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="SmartSafety")
    cur = connection.cursor()

    user = cur.execute('SELECT "user",' + "password FROM public.ipcam where ip = '%s';" % reIPofcam)
    records = cur.fetchall()
    cur.close()
    connection.close()
    if brand == "hikvision":
        connection = psycopg2.connect(user="postgres",
                                  password="123456789o",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="SmartSafety")
        cur = connection.cursor()
        user = cur.execute('SELECT "user",' + "password FROM public.thermal_cam where ip = '%s';" % reIPofcam)
        records = cur.fetchall()
        cur.close()
        connection.close()
        video = cv2.VideoCapture('rtsp://%s:%s@%s/Streaming/channels/01' % (records[0][0],records[0][1],reIPofcam))
    return Response(gen(video),
                    mimetype='multipart/x-mixed-replace; boundary=frame')
@app.route('/video_feed/axxon/<host>/<pin>')
def axn_vid(host,pin):
    video = cv2.VideoCapture('http://liger:12345678@10.172.10.1:8081/live/media/%s/DeviceIpint.%s/SourceEndpoint.video:0:0' % (host,pin))
    return Response(gen(video),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/testDB/<brand>/<ipOfCam>')
def testDB(brand, ipOfCam):

    connection = psycopg2.connect(user="postgres",
                                  password="123456789o",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="SmartSafety")
    cur = connection.cursor()

    reIPofcam = ipOfCam.replace("l", ".")
    user = cur.execute('SELECT "user",' + "password FROM public.ipcam where ip = '%s';" % reIPofcam)
    records = cur.fetchall()
    cur.close()
    connection.close()
    if brand == "hikvision":
        print('rtsp://%s:%s@%s/Streaming/channels/01' % (records[0][0],records[0][1],reIPofcam))
        video = cv2.VideoCapture()
    
  
    return Response('ok')


@app.route('/testpage')
def test1():
    return render_template('proto_graph.html')

# api get data
@app.route('/api/allcamera') 
def allcamera(): # จำนวนกล้อง need to edit
    return 100

@app.route('/api/smartploe_people') 
def smartpole_people(): # จำนวนคนที่ผ่าน smart pole(axxon) need to edit
    return 16

@app.route('/api/all_smartploe') 
def all_smartpole(): # จำนวน smart pole(axxon) need to edit
    return 18

@app.route('/api/hikcameraNote') 
def hikcamNote(): # นับข้อมูลจาก hikvision
    connection = psycopg2.connect(user="postgres",
                                  password="123456789o",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="SmartSafety")

    tojson_cursor = connection.cursor(cursor_factory=RealDictCursor)
    
    tojson_cursor.execute('SELECT "ipAddress",note FROM public.hikvisondata,public.thermal_cam \
        where "ipAddress" = ip group by "ipAddress",note;')
    note = tojson_cursor.fetchall()
    tojson_cursor.close()
    connection.close()
    
    return json.dumps(note)

@app.route('/api/isAbnomalTemp/<ip>') 
def isAbnomalTemp(ip):
    connection = psycopg2.connect(user="postgres",
                                  password="123456789o",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="SmartSafety")
    cur = connection.cursor()
    
    cur.execute('SELECT count("isAbnomalTemperature") FROM public.hikvisondata \
        where "ipAddress" =' + "'" + ip  +"'" + 'AND "isAbnomalTemperature" = ' + "'" + 'false' + "'"+ ';' )
    
    normal_data = cur.fetchall()
    cur.execute('SELECT count("isAbnomalTemperature") FROM public.hikvisondata \
        where "ipAddress" =' + "'" + ip  +"'" + 'AND "isAbnomalTemperature" != ' + "'" + 'false' + "'"+ ';' )
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
    connection = psycopg2.connect(user="postgres",
                                  password="123456789o",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="SmartSafety")
    cur = connection.cursor()
    
    cur.execute('SELECT "ageGroup",count("ageGroup") FROM public.hikvisondata \
                where "ipAddress" = ' +  "'" + ip + "'"  + 'group by "ageGroup";')
    
    AgeGroupdata = cur.fetchall()

    cur.execute('SELECT gender,count(gender) FROM public.hikvisondata \
                where "ipAddress" = ' +  "'" + ip + "'"  + 'group by gender;')
    gender = cur.fetchall()

    cur.execute('SELECT glass,count(glass) FROM public.hikvisondata \
                where "ipAddress" = ' +  "'" + ip + "'"  + 'group by glass;')
    glass = cur.fetchall()

    cur.execute('SELECT "faceExpression",count("faceExpression") FROM public.hikvisondata \
                where "ipAddress" = ' +  "'" + ip + "'"  + 'group by "faceExpression";')
    faceExpression = cur.fetchall()

    cur.execute('SELECT race,count(race) FROM public.hikvisondata \
                where "ipAddress" = ' +  "'" + ip + "'"  + 'group by race;')
    race = cur.fetchall()
    cur.execute('SELECT beard,count(beard) FROM public.hikvisondata \
                where "ipAddress" = ' +  "'" + ip + "'"  + 'group by beard;')
    beard = cur.fetchall()
    cur.execute('SELECT hat,count(hat) FROM public.hikvisondata \
                where "ipAddress" = ' +  "'" + ip + "'"  + 'group by hat;')
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

        axnApi = psycopg2.connect(user="AXNAPI",
                                  password="AXNAPI",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="AXNAPI")

        tojson_AXN = axnApi.cursor(cursor_factory=RealDictCursor)
        
        tojson_AXN.execute("SELECT display_name,typex,cast(sum(count) as bigint),host,devicepint \
        FROM ( select source,display_name,typex,count(typex),cast(substring(split_part(source, '/', 2),6,2) as integer) as host,cast(substring(split_part(public.events.source, '/', 3),13,2) as integer) as devicepint \
        ,to_date(substring(timestampx,1,8), 'YYYYMMDD') as days,substring(substring(timestampx,10,11),1,2) as hh,substring(substring(substring(timestampx,10,11),3,4),1,2) as mm \
        FROM public.events,public.cameras where  cast(substring(split_part(source, '/', 2),6,2)  as bigint) = public.cameras.host_id AND substring(split_part(public.events.source, '/', 3),13,2) = public.cameras.display_idx \
        group by source,typex,host,devicepint,display_name,days,hh,mm \
        order by host, devicepint,days,hh,mm) newval " +
        "where  typex = 'PeopleIn'" +
        "AND days  >= " + "'" + startDate + "'" + 
        "AND days <=" + "'" + endDate + "'" + 
        "group by display_name,typex,host,devicepint order by host, devicepint;"
        )
        peopleIn = json.dumps(tojson_AXN.fetchall())
        tojson_AXN.execute("SELECT display_name,typex,cast(sum(count) as bigint),host,devicepint \
        FROM ( select source,display_name,typex,count(typex),cast(substring(split_part(source, '/', 2),6,2) as integer) as host,cast(substring(split_part(public.events.source, '/', 3),13,2) as integer) as devicepint \
        ,to_date(substring(timestampx,1,8), 'YYYYMMDD') as days,substring(substring(timestampx,10,11),1,2) as hh,substring(substring(substring(timestampx,10,11),3,4),1,2) as mm \
        FROM public.events,public.cameras where  cast(substring(split_part(source, '/', 2),6,2)  as bigint) = public.cameras.host_id AND substring(split_part(public.events.source, '/', 3),13,2) = public.cameras.display_idx \
        group by source,typex,host,devicepint,display_name,days,hh,mm \
        order by host, devicepint,days,hh,mm) newval " +
        "where  typex = 'PeopleOut'" +
        "AND days  >= " + "'" + startDate + "'" + 
        "AND days <=" + "'" + endDate + "'" + 
        "group by display_name,typex,host,devicepint order by host, devicepint;"
        )
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

        axnApi = psycopg2.connect(user="AXNAPI",
                                  password="AXNAPI",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="AXNAPI")
        tojson_AXN = axnApi.cursor(cursor_factory=RealDictCursor)

        cctvName = request.form.get('cctvName')
        startDate = request.form.get('startDate')
        endDate = request.form.get('endDate')
        tojson_AXN.execute(
            "SELECT count(typex),cast(substring(split_part(source, '/', 2),6,2) as integer) as host,cast(substring(split_part(public.events.source, '/', 3),13,2) as integer) as devicepint \
            ,substring(substring(timestampx,10,11),1,2) as hh, \
            substring(substring(substring(timestampx,10,11),3,4),1,2) as mm \
            FROM public.events,public.cameras where  cast(substring(split_part(source, '/', 2),6,2)  as bigint) = public.cameras.host_id \
            AND substring(split_part(public.events.source, '/', 3),13,2) = public.cameras.display_idx \
            AND display_name = " + "'" + cctvName + "'"+ 
           "AND typex = 'PeopleIn' \
            AND to_date(substring(timestampx,1,8), 'YYYYMMDD')  >=" + "'" + startDate + "'" +
            "AND to_date(substring(timestampx,1,8), 'YYYYMMDD') <=" + "'" + endDate + "'" +
            "group by host,devicepint,display_name,hh,mm \
            order by host,devicepint,hh,mm;"
        )
        ppl_in_time = json.dumps(tojson_AXN.fetchall())
        tojson_AXN.execute(
            "SELECT count(typex),cast(substring(split_part(source, '/', 2),6,2) as integer) as host,cast(substring(split_part(public.events.source, '/', 3),13,2) as integer) as devicepint \
            ,substring(substring(timestampx,10,11),1,2) as hh, \
            substring(substring(substring(timestampx,10,11),3,4),1,2) as mm \
            FROM public.events,public.cameras where  cast(substring(split_part(source, '/', 2),6,2)  as bigint) = public.cameras.host_id \
            AND substring(split_part(public.events.source, '/', 3),13,2) = public.cameras.display_idx \
            AND display_name = " + "'" + cctvName + "'"+ 
           "AND typex = 'PeopleOut' \
            AND to_date(substring(timestampx,1,8), 'YYYYMMDD')  >=" + "'" + startDate + "'" +
            "AND to_date(substring(timestampx,1,8), 'YYYYMMDD') <=" + "'" + endDate + "'" +
            "group by host,devicepint,display_name,hh,mm \
            order by host,devicepint,hh,mm;"
        )
        ppl_out_time = json.dumps(tojson_AXN.fetchall())
        ret_data = {
            'ppl_in_time':ppl_in_time,
            'ppl_out_time':ppl_out_time
        }
        tojson_AXN.close()
        axnApi.close()
   
    return ret_data

# crud select to table
@app.route('/api/CameraJsonTable') 
def CameraJsonTable():
    connection = psycopg2.connect(user="postgres",
                                  password="123456789o",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="SmartSafety")
    cur = connection.cursor()
    
    cur.execute('SELECT * \
	FROM public.ipcam order by id;');
    records = cur.fetchall()
    print(cur.description)
    col_names = []
    for elt in cur.description:
        col_names.append(elt[0])
    print(col_names)
    print(len(records))
    
    table_row_column = {
        'column': col_names,
        'row': records
    }
    cur.close()
    connection.close()
    
    return table_row_column


@app.route('/api/thermalTable') 
def thermalTable():
    connection = psycopg2.connect(user="postgres",
                                  password="123456789o",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="SmartSafety")
    cur = connection.cursor()
    
    cur.execute('SELECT * \
	FROM public.thermal_cam order by id;');
    records = cur.fetchall()
    print(cur.description)
    col_names = []
    for elt in cur.description:
        col_names.append(elt[0])
    print(col_names)
    print(len(records))
    
    table_row_column = {
        'column': col_names,
        'row': records
    }
    cur.close()
    connection.close()
    
    return table_row_column


@app.route('/api/AxxonCameraTable') 
def AxxonCameraTable():
    
    axnApi = psycopg2.connect(user="AXNAPI",
                                  password="AXNAPI",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="AXNAPI")
                                  
    cur2 = axnApi.cursor()

    cur2.execute('SELECT * \
	FROM public.cameras order by id;');
    records = cur2.fetchall()
    print(cur2.description)
    col_names = []
    for elt in cur2.description:
        col_names.append(elt[0])
    print(col_names)
    print(len(records))
    
    table_row_column = {
        'column': col_names,
        'row': records
    }
    cur2.close()
    axnApi.close()
    
    return table_row_column


# crud crerate ;
@app.route('/api/add/thermalCam',methods = ['POST']) 
def add_thermal_cam():
    if request.method == 'POST':
        connection = psycopg2.connect(user="postgres",
                                  password="123456789o",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="SmartSafety")
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

@app.route('/api/add/LibCam',methods = ['POST']) 
def add_Lib_cam():
    if request.method == 'POST':
        connection = psycopg2.connect(user="postgres",
                                  password="123456789o",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="SmartSafety")
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

@app.route('/api/add/axxoncam',methods = ['POST']) 
def add_axxoncam():
    if request.method == 'POST':
        axnApi = psycopg2.connect(user="AXNAPI",
                                  password="AXNAPI",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="AXNAPI")
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

        cur2.execute('''INSERT INTO public.cameras(host_id, display_idx, display_name, ip, latitude,longtitude, model,vendor,created_at,updated_at,thai_name) \
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

# crud edit ;
@app.route('/api/edit/thermalCam',methods = ['POST']) 
def edit_thermal_cam():
    if request.method == 'POST':
        connection = psycopg2.connect(user="postgres",
                                  password="123456789o",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="SmartSafety")
        cur = connection.cursor()
        
        ip = request.form.get('ip')
        user = request.form.get('user')
        password = request.form.get('password')
        location = request.form.get('location')
        note = request.form.get('note')
        idIndex = request.form.get('id')

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

@app.route('/api/edit/LibCam/<idInput>',methods = ['POST']) 
def edit_Lib_cam(idInput):
    if request.method == 'POST':
        connection = psycopg2.connect(user="postgres",
                                  password="123456789o",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="SmartSafety")
        cur = connection.cursor()
        
        ip = request.form.get('ip')
        user = request.form.get('user')
        password = request.form.get('password')
        brand = request.form.get('brand')
        model = request.form.get('model')
        note = request.form.get('note')

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
    
    
    return 'add LibCam complete'

@app.route('/api/edit/axxoncam',methods = ['POST']) 
def edit_axxoncam():
    if request.method == 'POST':
        axnApi = psycopg2.connect(user="AXNAPI",
                                  password="AXNAPI",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="AXNAPI")
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
        idIndex = request.form.get('id')

        cur2.execute('''update public.cameras set host_id = '%s', display_idx = '%s', display_name = '%s', ip = '%s', latitude = '%s',longtitude = '%s', model = '%s',vendor = '%s',created_at = '%s',updated_at = '%s',thai_name =  '%s' \
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
    
    return 'add axxon complete'

# crud delete

@app.route('/api/del/thermalCam',methods = ['POST']) 
def del_thermal_cam():
    if request.method == 'POST':
        connection = psycopg2.connect(user="postgres",
                                  password="123456789o",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="SmartSafety")
        cur = connection.cursor()
        
        del_id = request.form.get('del_id')
       

        cur.execute('''delete from public.thermal_cam where id = '%s'; ''' %(
            del_id,
        ))
        connection.commit()
        cur.close()
        connection.close()
    
    
    return 'edit complete'

@app.route('/api/del/LibCam/',methods = ['POST']) 
def del_Lib_cam():
    if request.method == 'POST':
        connection = psycopg2.connect(user="postgres",
                                  password="123456789o",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="SmartSafety")
        cur = connection.cursor()
        
        del_id = request.form.get('del_id')

        cur.execute('''delete from public.ipcam where id = '%s';''' %(
            del_id
        ))
        connection.commit()
        cur.close()
        connection.close()
    
    
    return 'add LibCam complete'

@app.route('/api/del/axxoncam',methods = ['POST']) 
def del_axxoncam():
    if request.method == 'POST':
        axnApi = psycopg2.connect(user="AXNAPI",
                                  password="AXNAPI",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="AXNAPI")
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
        idIndex = request.form.get('id')

        cur2.execute('''update public.cameras set host_id = '%s', display_idx = '%s', display_name = '%s', ip = '%s', latitude = '%s',longtitude = '%s', model = '%s',vendor = '%s',created_at = '%s',updated_at = '%s',thai_name =  '%s' \
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
    
    return 'add axxon complete'




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=2204, threaded=True,debug=True)