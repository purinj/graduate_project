import cv2
import psycopg2
import json
from psycopg2.extras import RealDictCursor
from raw_sql_command import *
import base64
import requests
import datetime
from wrapt_timeout_decorator import *
import threading


#---------SmartSafety DB ------------#
smartsafty_user = ""
smartsafty_password =""
smartsafty_host = ""
smartsafty_port = "5432"
smartsafty_dbname = ""
### SQLAlchemy Config ####

#---------AXNAPI DB ------------#
AXNAPIdb_user = ""
AXNAPIdb_password = ""
AXNAPIdb_host = ""
AXNAPIdb_port = "5432"
AXNAPIdb_dbname = ""
#---------AXNAPI DB ------------#

def check_video(video):
    try:
        uccess,image = video.read()
        # print(success,image)
        ret,jpeg = cv2.imencode('.jpg', image)
    except cv2.error as e:
        meaage = 'loss'
    else:
        meaage = 'Pass'
    return meaage

def checkAxxon():
    def axxonStatus(host,pin):
        @timeout(5)
        def checking():
            video = cv2.VideoCapture('http://liger:12345678@10.172.10.1:8081/live/media/AXXON%s/DeviceIpint.%s/SourceEndpoint.video:0:1' % (host,pin))
            status = check_video(video)
            return status

        try:
            stat = checking()
        except TimeoutError:
            stat = 'wait'
        return stat
    connection = psycopg2.connect(user=AXNAPIdb_user,password=AXNAPIdb_password,host=AXNAPIdb_host,port=AXNAPIdb_port,database=AXNAPIdb_dbname)
    cur = connection.cursor()
    cur.execute('''select host_id,display_idx from public.cameras''')
    all_link_data = cur.fetchall()
    cur.close()
    connection.close()
    print(all_link_data)
    for i in all_link_data:
        if len(str(i[0])) < 2:
            host = '0' + str(i[0])
        else:
            host = str(i[0])

        if len(str(i[1])) < 2:
            pin = '0' + str(i[1])
        else:
            pin = str(i[1])
        # print(host,pin)

        # print(axxonStatus(host,pin))
        message = ''' UPDATE public.cameras SET status='%s', status_update='%s' WHERE host_id = %s and display_idx ='%s'; ''' %(axxonStatus(host,pin),datetime.datetime.now(),i[0],i[1])
        # print(message)
        connection = psycopg2.connect(user=AXNAPIdb_user,password=AXNAPIdb_password,host=AXNAPIdb_host,port=AXNAPIdb_port,database=AXNAPIdb_dbname)
        cur = connection.cursor()
        cur.execute(message)
        connection.commit()
        cur.close()
        connection.close()
        

def check_allcamera():
    def status_out(link):
        @timeout(5)
        def checking():
            video = cv2.VideoCapture(link)
            status = check_video(video)
            return status
        try:
            stat = checking()
        except TimeoutError:
            stat = 'wait'
        return stat
    connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
    cur = connection.cursor()
    cur.execute('''select id,stream_url from public.all_cameras''')
    all_link_data = cur.fetchall()
    cur.close()
    connection.close()
    for i in all_link_data:
        # print(i)
        # print(status_out(i[1]))
        message = ''' UPDATE public.all_cameras SET status='%s', status_update='%s' WHERE id=%s; ''' %(status_out(i[1]),datetime.datetime.now(),i[0])
        # print(message)
        connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        cur = connection.cursor()
        cur.execute(message)
        connection.commit()
        cur.close()
        connection.close()
        
    

if __name__ == '__main__':
    print('check Status of allcamera')
    allcam = threading.Thread(target=check_allcamera, args=())
    allcam.start()
    print('check Status of Axxon')
    smartpole = threading.Thread(target=checkAxxon(), args=())
    smartpole.start()
    