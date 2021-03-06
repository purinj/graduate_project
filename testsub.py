import re
import json
import psycopg2
blank = ''
text = '{\t"ipAddress":\t"10.209.7.57",\t"portNo":\t80,\t"protocol":\t"HTTP",\t"macAddress":\t"a4:14:37:84:50:a1",\t"channelID":\t1,\t"dateTime":\t"2020-12-30T13:08:29+07:00",\t"activePostCount":\t1,\t"eventType":\t"faceCapture",\t"eventState":\t"active",\t"eventDescription":\t"faceCapture",\t"channelName":\t"THERMAL CAMERA Gate1",\t"faceCapture":\t[{\t\t\t"targetAttrs":\t{\t\t\t\t"deviceChannel":\t1,\t\t\t\t"deviceName":\t"THERMAL CAMERA",\t\t\t\t"faceTime":\t"2020-12-30T13:08:29+07:00",\t\t\t\t"contentID":\t"backgroundImage"\t\t\t},\t\t\t"faces":\t[{\t\t\t\t\t"faceId":\t16374,\t\t\t\t\t"faceRect":\t{\t\t\t\t\t\t"height":\t127.593,\t\t\t\t\t\t"width":\t55.208,\t\t\t\t\t\t"x":\t456.250,\t\t\t\t\t\t"y":\t381.667,\t\t\t\t\t\t"age":\t{\t\t\t\t\t\t\t"value":\t23,\t\t\t\t\t\t\t"ageGroup":\t"young"\t\t\t\t\t\t},\t\t\t\t\t\t"gender":\t{\t\t\t\t\t\t\t"value":\t"female"\t\t\t\t\t\t},\t\t\t\t\t\t"glass":\t{\t\t\t\t\t\t\t"value":\t"yes"\t\t\t\t\t\t},\t\t\t\t\t\t"faceExpression":\t{\t\t\t\t\t\t\t"value":\t"sad"\t\t\t\t\t\t},\t\t\t\t\t\t"race":\t{\t\t\t\t\t\t\t"value":\t"asians"\t\t\t\t\t\t},\t\t\t\t\t\t"beard":\t{\t\t\t\t\t\t\t"value":\t"no"\t\t\t\t\t\t},\t\t\t\t\t\t"hat":\t{\t\t\t\t\t\t\t"value":\t"no"\t\t\t\t\t\t}\t\t\t\t\t},\t\t\t\t\t"contentID":\t"faceImage",\t\t\t\t\t"stayDuration":\t0,\t\t\t\t\t"faceScore":\t23,\t\t\t\t\t"captureEndMark":\t"false",\t\t\t\t\t"FacePictureRect":\t{\t\t\t\t\t\t"height":\t1000.000,\t\t\t\t\t\t"width":\t1000.000,\t\t\t\t\t\t"x":\t0.000,\t\t\t\t\t\t"y":\t0.000\t\t\t\t\t},\t\t\t\t\t"swingAngle":\t0,\t\t\t\t\t"tiltAngle":\t0,\t\t\t\t\t"pupilDistance":\t21,\t\t\t\t\t"livenessDetectionStatus":\t"notLiveFace",\t\t\t\t\t"faceSnapThermometryEnabled":\t"true",\t\t\t\t\t"currTemperature":\t35.9,\t\t\t\t\t"isAbnomalTemperature":\t"false",\t\t\t\t\t"thermometryUnit":\t"celsius",\t\t\t\t\t"alarmTemperature":\t37.5\t\t\t\t}],\t\t\t"uid":\t"2020123013082900027047b103b0d47fb3c4420b657f8e90631963a326b68074"\t\t}]}'
tex2 = '{\t"ipAddress":\t"10.209.7.57",\t"portNo":\t80,\t"protocol":\t"HTTP",\t"macAddress":\t"a4:14:37:84:50:a1",\t"channelID":\t1,\t"dateTime":\t"2021-01-06T14:29:45+07:00",\t"activePostCount":\t1,\t"eventType":\t"faceCapture",\t"eventState":\t"active",\t"eventDescription":\t"faceCapture",\t"channelName":\t"THERMAL CAMERA Gate1",\t"faceCapture":\t[{\t\t\t"targetAttrs":\t{\t\t\t\t"deviceChannel":\t1,\t\t\t\t"deviceName":\t"THERMAL CAMERA",\t\t\t\t"faceTime":\t"2021-01-06T14:29:45+07:00",\t\t\t\t"contentID":\t"backgroundImage"\t\t\t},\t\t\t"faces":\t[{\t\t\t\t\t"faceId":\t22370,\t\t\t\t\t"faceRect":\t{\t\t\t\t\t\t"height":\t81.852,\t\t\t\t\t\t"width":\t35.417,\t\t\t\t\t\t"x":\t228.125,\t\t\t\t\t\t"y":\t194.074,\t\t\t\t\t\t"age":\t{\t\t\t\t\t\t\t"value":\t41,\t\t\t\t\t\t\t"ageGroup":\t"middle"\t\t\t\t\t\t},\t\t\t\t\t\t"gender":\t{\t\t\t\t\t\t\t"value":\t"female"\t\t\t\t\t\t},\t\t\t\t\t\t"glass":\t{\t\t\t\t\t\t\t"value":\t"no"\t\t\t\t\t\t},\t\t\t\t\t\t"faceExpression":\t{\t\t\t\t\t\t\t"value":\t"sad"\t\t\t\t\t\t},\t\t\t\t\t\t"race":\t{\t\t\t\t\t\t\t"value":\t"asians"\t\t\t\t\t\t},\t\t\t\t\t\t"beard":\t{\t\t\t\t\t\t\t"value":\t"no"\t\t\t\t\t\t},\t\t\t\t\t\t"hat":\t{\t\t\t\t\t\t\t"value":\t"no"\t\t\t\t\t\t}\t\t\t\t\t},\t\t\t\t\t"contentID":\t"faceImage",\t\t\t\t\t"stayDuration":\t0,\t\t\t\t\t"faceScore":\t16,\t\t\t\t\t"captureEndMark":\t"false",\t\t\t\t\t"FacePictureRect":\t{\t\t\t\t\t\t"height":\t1000.000,\t\t\t\t\t\t"width":\t1000.000,\t\t\t\t\t\t"x":\t0.000,\t\t\t\t\t\t"y":\t0.000\t\t\t\t\t},\t\t\t\t\t"swingAngle":\t0,\t\t\t\t\t"tiltAngle":\t0,\t\t\t\t\t"pupilDistance":\t32,\t\t\t\t\t"livenessDetectionStatus":\t"notLiveFace",\t\t\t\t\t"faceSnapThermometryEnabled":\t"true",\t\t\t\t\t"currTemperature":\t35.9,\t\t\t\t\t"isAbnomalTemperature":\t"false",\t\t\t\t\t"thermometryUnit":\t"celsius",\t\t\t\t\t"alarmTemperature":\t37.5\t\t\t\t}],\t\t\t"uid":\t"202101061429450006316e9f127930ff8258f0e221cfbc577703f23e861582ca"\t\t}]}'
tex_test = blank + tex2
text3 = tex_test.replace('\t','')
# print(tex2.translate(None, '\t\n '))
print(text)
# print(json.loads(text3))

# def fetching():
#     link = "http://10.209.7.57/ISAPI/Event/notification/alertStream"
#     f = requests.get(link, auth=HTTPDigestAuth('admin', 'P@ssw0rd'), timeout=5)
#     print(f)
#     print(datetime.now())
#     # Timer(5,fetching())


# def fetching():
#     link = "http://10.209.7.57/ISAPI/Thermal/channels/2/thermometry/1/rulesTemperatureInfo?format=json"
#     f = requests.get(link, auth=HTTPDigestAuth('admin', 'P@ssw0rd'))
#     fjson = json.loads(f.text)
#     print(fjson["ThermometryRulesTemperatureInfoList"]['ThermometryRulesTemperatureInfo'])
#     Timer(5,fetching())

# fetching()
connection = psycopg2.connect(user="postgres",
                                  password="123456789o",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="SmartSafety")

cur = connection.cursor()


def record_json(str):
    x = json.loads(re.sub(r'\s', '', str))
    # print(x["faceCapture"][0]["faces"][0]["faceRect"]["age"]["value"])
    ipAddress = x["ipAddress"] # pass
    portNo = x["portNo"] # pass
    protocol =  x["protocol"] # pass
    macAddress = x["macAddress"] # pass
    channelID = x["channelID"] # pass
    dateTime = x["dateTime"] # pass
    activePostCount = x["activePostCount"] # pass
    eventType = x["eventType"] # pass
    eventState = x["eventState"] # pass
    eventDescription = x["eventDescription"] # pass
    channelName = x["channelName"] # pass
    faceId = x["faceCapture"][0]["faces"][0]["faceId"] # pass
    age = x["faceCapture"][0]["faces"][0]["faceRect"]["age"]["value"] # pass
    ageGroup = x["faceCapture"][0]["faces"][0]["faceRect"]["age"]["ageGroup"] # pass
    gender = x["faceCapture"][0]["faces"][0]["faceRect"]["gender"]["value"] # pass
    glass = x["faceCapture"][0]["faces"][0]["faceRect"]["glass"]["value"] # pass
    faceExpression = x["faceCapture"][0]["faces"][0]["faceRect"]["faceExpression"]["value"] # pass
    race = x["faceCapture"][0]["faces"][0]["faceRect"]["race"]["value"] # pass 
    beard = x["faceCapture"][0]["faces"][0]["faceRect"]["beard"]["value"] # pass
    hat = x["faceCapture"][0]["faces"][0]["faceRect"]["hat"]["value"] # pass
    currTemperature = x["faceCapture"][0]["faces"][0]["currTemperature"] # pass
    isAbnomalTemperature = x["faceCapture"][0]["faces"][0]["isAbnomalTemperature"] # pass
    thermometryUnit = x["faceCapture"][0]["faces"][0]["thermometryUnit"] # pass
    alarmTemperature = x["faceCapture"][0]["faces"][0]["alarmTemperature"] # pass
    uid = x["faceCapture"][0]["uid"] # pass
    print(ipAddress)
    cur.execute('''INSERT INTO public.hikvisondata("ipAddress", "portNo", protocol, "macAddress", "channelID", "dateTime", "activePostCount", "eventType", "eventState", "eventDescription", "channelName", "faceId", age, "ageGroup", gender, glass, "faceExpression", race, beard, hat, "currTemperature", "isAbnomalTemperature", "thermometryUnit", "alarmTemperature", uid) VALUES ('%s', '%s', '%s', '%s', %s, '%s', %s, '%s', '%s', '%s', '%s', '%s', %s, '%s', '%s', '%s', '%s', '%s', '%s', '%s', %s, '%s', '%s', %s, '%s');''' % (
        ipAddress,
        portNo,
        protocol,
        macAddress,
        channelID,
        dateTime,
        activePostCount,
        eventType,
        eventState,
        eventDescription,
        channelName,
        faceId,
        age,
        ageGroup,
        gender,
        glass,
        faceExpression,
        race,
        beard,
        hat,
        currTemperature,
        isAbnomalTemperature,
        thermometryUnit,
        alarmTemperature,
        uid
    ))
    connection.commit()
    print('success')





# record_json(text)