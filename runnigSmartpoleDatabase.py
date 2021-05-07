import psycopg2
from psycopg2.extras import RealDictCursor
#---------AXNAPI DB ------------#
src_AXNAPIdb_user = ""
src_AXNAPIdb_password = ""
src_AXNAPIdb_host = ""
src_AXNAPIdb_port = "5432"
src_AXNAPIdb_dbname = ""
#---------AXNAPI DB ------------#

#---------AXNAPI DB ------------#
des_AXNAPIdb_user = ""
des_AXNAPIdb_password = ""
des_AXNAPIdb_host = ""
des_AXNAPIdb_port = ""
des_AXNAPIdb_dbname = ""
#---------AXNAPI DB ------------#
def select_src(code_query):
    connection = psycopg2.connect(user=src_AXNAPIdb_user,password=src_AXNAPIdb_password,host=src_AXNAPIdb_host,port=src_AXNAPIdb_port,database=src_AXNAPIdb_dbname)
    cur = connection.cursor()
    cur.execute(code_query)
    data = cur.fetchall()
    cur.close()
    connection.close()
    return data

def select_dictsrc(code_query):
    connection = psycopg2.connect(user=src_AXNAPIdb_user,password=src_AXNAPIdb_password,host=src_AXNAPIdb_host,port=src_AXNAPIdb_port,database=src_AXNAPIdb_dbname)
    cur = connection.cursor(cursor_factory=RealDictCursor)
    cur.execute(code_query)
    data = cur.fetchall()
    cur.close()
    connection.close()
    return data

def select_dictdes(code_query):
    connection = psycopg2.connect(user=des_AXNAPIdb_user,password=des_AXNAPIdb_password,host=des_AXNAPIdb_host,port=des_AXNAPIdb_port,database=des_AXNAPIdb_dbname)
    cur = connection.cursor(cursor_factory=RealDictCursor)
    cur.execute(code_query)
    data = cur.fetchall()
    cur.close()
    connection.close()
    return data

def record_des(code_query):
    connection = psycopg2.connect(user=des_AXNAPIdb_user,password=des_AXNAPIdb_password,host=des_AXNAPIdb_host,port=des_AXNAPIdb_port,database=des_AXNAPIdb_dbname)
    cur = connection.cursor()
    cur.execute(code_query)
    connection.commit()
    cur.close()
    connection.close()
    print('recorded')
def chechdataNull(inputer):
    if inputer == None:
        return 'null'
    else:
        return inputer

recent_record = select_dictdes('''SELECT id, host_id, camera_id, alert_state, idx, multi_phase_sync_idx, origin, rectangles, source, timestampx, "timestamp", typex, created_at, updated_at
 	FROM public.events where id = (select max(id) from public.events); ''')
print(recent_record[0]['id'])



def findEachreord(NumberForCheck):
    NumberForCheck = int(NumberForCheck)
    print(NumberForCheck + 1)
    src_topid = select_dictsrc('''SELECT id, host_id, camera_id, alert_state, idx, multi_phase_sync_idx, origin, rectangles, source, timestampx, "timestamp", typex, created_at, updated_at, date
	FROM public.events where id = (select max(id) from public.events); ''') 
    if int(src_topid[0]['id']) == NumberForCheck + 1:
        print('already top')
    else:
        src4data = select_dictsrc('''SELECT id, host_id, camera_id, alert_state, idx, multi_phase_sync_idx, origin, rectangles, source, timestampx, "timestamp", typex, created_at, updated_at, date
            FROM public.events where id = %s  ''' %(NumberForCheck + 1))
        if (src4data[0]['typex'] == 'PeopleIn' or src4data[0]['typex'] == 'PeopleOut'):
            # print(src4data[0])
            if (src4data[0]['timestamp'] != 'null'):
                record_des('''INSERT INTO public.events(
        id, host_id, camera_id, alert_state, idx, multi_phase_sync_idx, origin, rectangles, source, timestampx, "timestamp", typex, created_at, updated_at,date)
        VALUES (%s, %s, %s, '%s', '%s', '%s','%s' ,'%s' ,'%s' ,'%s' , '%s', '%s', '%s', '%s','%s'); ''' %(
            chechdataNull(src4data[0]['id']),
            chechdataNull(src4data[0]['host_id']),
            chechdataNull(src4data[0]['camera_id']),
            chechdataNull(src4data[0]['alert_state']),
            chechdataNull(src4data[0]['idx']),
            chechdataNull(src4data[0]['multi_phase_sync_idx']),
            chechdataNull(src4data[0]['origin']),
            chechdataNull(src4data[0]['rectangles']),
            chechdataNull(src4data[0]['source']),
            chechdataNull(src4data[0]['timestampx']),
            chechdataNull(src4data[0]['timestamp']),
            chechdataNull(src4data[0]['typex']),
            chechdataNull(src4data[0]['created_at']),
            chechdataNull(src4data[0]['updated_at']),
             chechdataNull(src4data[0]['date'])
        ))
            else:
                record_des('''INSERT INTO public.events(
        id, host_id, camera_id, alert_state, idx, multi_phase_sync_idx, origin, rectangles, source, timestampx, "timestamp", typex, created_at, updated_at,date)
        VALUES (%s, %s, %s, '%s', '%s', '%s','%s' ,'%s' ,'%s' ,'%s' , %s, '%s', '%s', '%s','%s'); ''' %(
            chechdataNull(src4data[0]['id']),
            chechdataNull(src4data[0]['host_id']),
            chechdataNull(src4data[0]['camera_id']),
            chechdataNull(src4data[0]['alert_state']),
            chechdataNull(src4data[0]['idx']),
            chechdataNull(src4data[0]['multi_phase_sync_idx']),
            chechdataNull(src4data[0]['origin']),
            chechdataNull(src4data[0]['rectangles']),
            chechdataNull(src4data[0]['source']),
            chechdataNull(src4data[0]['timestampx']),
            chechdataNull(src4data[0]['timestamp']),
            chechdataNull(src4data[0]['typex']),
            chechdataNull(src4data[0]['created_at']),
            chechdataNull(src4data[0]['updated_at']),
            chechdataNull(src4data[0]['date'])
        ))
            print('Recorded')
        else:
            print('not focus event')
    global recent_record
    recent_record = src4data
    
while True:
    findEachreord(recent_record[0]['id'])  




# src_data = select_dictsrc('''SELECT id, host_id, camera_id, alert_state, idx, multi_phase_sync_idx, origin, rectangles, source, timestampx, "timestamp", typex, created_at, updated_at, date
# 	FROM public.events where id = (select max(id) from public.events); ''') 
# print(src_data[0])


# record_des('''INSERT INTO public.events(
# 	id, host_id, camera_id, alert_state, idx, multi_phase_sync_idx, origin, rectangles, source, timestampx, "timestamp", typex, created_at, updated_at)
# 	VALUES (%s, %s, %s, '%s', '%s', '%s','%s' ,'%s' ,'%s' ,'%s' , '%s', '%s', '%s', '%s'); ''' %(
#         chechdataNull(src_data[0]['id']),
#         chechdataNull(src_data[0]['host_id']),
#         chechdataNull(src_data[0]['camera_id']),
#         chechdataNull(src_data[0]['alert_state']),
#         chechdataNull(src_data[0]['idx']),
#         chechdataNull(src_data[0]['multi_phase_sync_idx']),
#         chechdataNull(src_data[0]['origin']),
#         chechdataNull(src_data[0]['rectangles']),
#         chechdataNull(src_data[0]['source']),
#         chechdataNull(src_data[0]['timestampx']),
#         chechdataNull(src_data[0]['timestamp']),
#         chechdataNull(src_data[0]['typex']),
#         chechdataNull(src_data[0]['created_at']),
#         chechdataNull(src_data[0]['updated_at']),
#     )) 

