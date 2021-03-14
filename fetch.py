import requests
from requests.auth import HTTPDigestAuth
import json
from threading import Timer
from datetime import datetime
import time
import re
import psycopg2
from multiprocessing import Process
import logging
import threading

def get_stream(url,user,psw,process):  #send request function
    s = requests.Session()
    r = s.get(url, auth=HTTPDigestAuth(user, psw), stream=True)
    print('process ' + process + ' is runing')
    reading(r) # read data from request 
    
        
def reading(read_input): 
    transform_str = ''
    condition_json = False
    is_in_condition = False
    for line in read_input.iter_lines(): #read each line 
        raw_data = str(line)[2:-1]
        #print(raw_data)
        # find condition json data from mixtype data 
        if raw_data == 'Content-Type: application/json; charset="UTF-8"':
            condition_json = True 


        if condition_json and raw_data == '{':
            is_in_condition = True  # enable to get json 
        
        if condition_json and raw_data == '}':
            is_in_condition = False
            transform_str += '}'
            #print(transform_str)
            record_json(transform_str)  # recording
            transform_str = '' # clear string after record
            condition_json = False
            

        if is_in_condition:
            transform_str += raw_data # get json data 


def record_json(str): # turn data without \t to json record json data to database

    x = json.loads(str.replace(r'\t','')) # remove \t which \t is not tab use r'\t' instead of \t
    
    connection = psycopg2.connect(user="postgres",
                                    password="123456789o",
                                    host="10.101.118.45",
                                    port="5432",
                                    database="SmartSafety") # connect to database

    cur = connection.cursor() # database cursor
   
    # check json fied
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

    cur.execute('''INSERT INTO public.hikvisondata("ipAddress", "portNo", protocol, "macAddress", "channelID", "dateTime", "activePostCount", "eventType", "eventState", "eventDescription", "channelName", "faceId", age, "ageGroup", gender, glass, "faceExpression", race, beard, hat, "currTemperature", "isAbnomalTemperature", "thermometryUnit", "alarmTemperature", uid, time_stamp) VALUES ('%s', '%s', '%s', '%s', %s, '%s', %s, '%s', '%s', '%s', '%s', '%s', %s, '%s', '%s', '%s', '%s', '%s', '%s', '%s', %s, '%s', '%s', %s, '%s','%s');''' % (
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
        uid,
        dateTime
    ))
    connection.commit()  # finish insert
    cur.close() # close connection
    connection.close()  

#get_stream('http://10.209.7.57/ISAPI/Event/notification/alertStream','admin','P@ssw0rd') # use the main fuction
# 10.88.120.241,242 admin 1q2w3e4r@kku

if __name__ == '__main__':
     libGate1 = threading.Thread(target=get_stream, args=('http://10.209.7.57/ISAPI/Event/notification/alertStream','admin','P@ssw0rd','1'))
     libGate1.start()

     libGate2 = threading.Thread(target=get_stream, args=('http://10.209.7.58/ISAPI/Event/notification/alertStream','admin','P@ssw0rd','2'))
     libGate2.start()
     
     sirikunakorn1 = threading.Thread(target=get_stream, args=('http://10.88.120.241/ISAPI/Event/notification/alertStream','admin','1q2w3e4r@kku','3'))
     sirikunakorn1.start()


     sirikunakorn2 = threading.Thread(target=get_stream, args=('http://10.88.120.242/ISAPI/Event/notification/alertStream','admin','1q2w3e4r@kku','4'))
     sirikunakorn2.start()

#   p1 = Process(target=get_stream('http://10.209.7.57/ISAPI/Event/notification/alertStream','admin','P@ssw0rd'))
#   p1.start()
#   p2 = Process(target=get_stream('http://10.88.120.241/ISAPI/Event/notification/alertStream','admin','1q2w3e4r@kku'))
#   p2.start()
#   p3 = Process(target=get_stream('http://10.88.120.242/ISAPI/Event/notification/alertStream','admin','1q2w3e4r@kku'))
#   p3.start()

#   p1.join()
#   p2.join()
#   p3.join()