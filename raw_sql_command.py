find_user_password = '''SELECT "user", password FROM public.ipcam where ip = '%s';'''
find_user_password_thermal ='''SELECT "user", password FROM public.thermal_cam where ip = '%s';'''

# (function of url)_(NameOfdata)
hikcamNote_select = 'SELECT  ip as "ipAddress",  camera_name as note FROM public.all_cameras where cam_type = 3'

isAbnomalTemp_normalTemp = '''SELECT count("isAbnomalTemperature") FROM public.hikvisondata \
        where "ipAddress" = '%s' AND "isAbnomalTemperature" = 'false';'''

isAbnomalTemp_normalTempByDate = '''SELECT count("isAbnomalTemperature") FROM public.hikvisondata  \
        where "ipAddress" = '%s' AND "isAbnomalTemperature" = 'false' AND time_stamp::date < '%s' \
        AND time_stamp::date > '%s'; '''

isAbnomalTemp_highTemp = '''SELECT count("isAbnomalTemperature") FROM public.hikvisondata \
        where "ipAddress" = '%s' AND "isAbnomalTemperature" !=  'false';'''

isAbnomalTemp_highTempByDate = ''' SELECT count("isAbnomalTemperature") FROM public.hikvisondata  \
where "ipAddress" = '%s' AND "isAbnomalTemperature" != 'false' AND time_stamp::date < '%s' \
AND time_stamp::date > '%s'; '''

hikVisionData_AgeGroupdata = '''SELECT "ageGroup",count("ageGroup") FROM public.hikvisondata \
                where "ipAddress" = '%s' %s group by "ageGroup";'''

hikVisionData_gender = '''SELECT gender,count(gender) FROM public.hikvisondata \
                where "ipAddress" = '%s' %s group by gender;'''

hikVisionData_glass = '''SELECT glass,count(glass) FROM public.hikvisondata \
                where "ipAddress" = '%s' %s group by glass;'''

hikVisionData_faceExpression = '''SELECT "faceExpression",count("faceExpression") FROM public.hikvisondata \
                where "ipAddress" = '%s' %s group by "faceExpression";'''

hikVisionData_race = '''SELECT race,count(race) FROM public.hikvisondata \
                where "ipAddress" = '%s' %s group by race;'''

hikVisionData_beard = '''SELECT beard,count(beard) FROM public.hikvisondata \
                where "ipAddress" = '%s' %s group by beard;'''

hikVisionData_hat = '''SELECT hat,count(hat) FROM public.hikvisondata \
                where "ipAddress" = '%s' %s group by hat;'''

AxxonDataWithTime_PeopleIn = '''SELECT display_name,typex,cast(sum(count) as bigint),host,devicepint \
        FROM ( select source,display_name,typex,count(typex),cast(substring(split_part(source, '/', 2),6,2) as integer) as host,cast(substring(split_part(public.events.source, '/', 3),13,2) as integer) as devicepint \
        ,to_date(substring(timestampx,1,8), 'YYYYMMDD') as days,substring(substring(timestampx,10,11),1,2) as hh,substring(substring(substring(timestampx,10,11),3,4),1,2) as mm \
        FROM public.events,public.cameras where cast(substring(split_part(source, '/', 2),6,2)  as bigint) = public.cameras.host_id AND substring(split_part(public.events.source, '/', 3),13,2) = public.cameras.display_idx \
        group by source,typex,host,devicepint,display_name,days,hh,mm \
        order by host, devicepint,days,hh,mm) newval \
        where typex = 'PeopleIn'
        AND days  >=  '%s' 
        AND days <= '%s' 
        group by display_name,typex,host,devicepint order by host, devicepint;'''

AxxonDataWithTime_PeopleOut = '''SELECT display_name,typex,cast(sum(count) as bigint),host,devicepint \
        FROM ( select source,display_name,typex,count(typex),cast(substring(split_part(source, '/', 2),6,2) as integer) as host,cast(substring(split_part(public.events.source, '/', 3),13,2) as integer) as devicepint \
        ,to_date(substring(timestampx,1,8), 'YYYYMMDD') as days,substring(substring(timestampx,10,11),1,2) as hh,substring(substring(substring(timestampx,10,11),3,4),1,2) as mm \
        FROM public.events,public.cameras where  cast(substring(split_part(source, '/', 2),6,2)  as bigint) = public.cameras.host_id AND substring(split_part(public.events.source, '/', 3),13,2) = public.cameras.display_idx \
        group by source,typex,host,devicepint,display_name,days,hh,mm
        order by host, devicepint,days,hh,mm) newval 
        where  typex = 'PeopleOut'
        AND days  >=  '%s'
        AND days <= '%s'
        group by display_name,typex,host,devicepint order by host, devicepint;'''

axxonTimeScale_ppl_in_time = '''SELECT count(typex),cast(substring(split_part(source, '/', 2),6,2) as integer) as host,cast(substring(split_part(public.events.source, '/', 3),13,2) as integer) as devicepint \
            ,substring(substring(timestampx,10,11),1,2) as hh, \
            substring(substring(substring(timestampx,10,11),3,4),1,2) as mm \
            FROM public.events,public.cameras where  cast(substring(split_part(source, '/', 2),6,2)  as bigint) = public.cameras.host_id \
            AND substring(split_part(public.events.source, '/', 3),13,2) = public.cameras.display_idx \
            AND display_name = '%s'
            AND typex = 'PeopleIn'
            AND to_date(substring(timestampx,1,8), 'YYYYMMDD')  >= '%s'
            AND to_date(substring(timestampx,1,8), 'YYYYMMDD') <= '%s'
            group by host,devicepint,display_name,hh,mm \
            order by host,devicepint,hh,mm;'''

axxonTimeScale_ppl_out_time = '''SELECT count(typex),cast(substring(split_part(source, '/', 2),6,2) as integer) as host,cast(substring(split_part(public.events.source, '/', 3),13,2) as integer) as devicepint \
            ,substring(substring(timestampx,10,11),1,2) as hh, \
            substring(substring(substring(timestampx,10,11),3,4),1,2) as mm \
            FROM public.events,public.cameras where  cast(substring(split_part(source, '/', 2),6,2)  as bigint) = public.cameras.host_id \
            AND substring(split_part(public.events.source, '/', 3),13,2) = public.cameras.display_idx \
            AND display_name = '%s' \
            AND typex = 'PeopleOut' \
            AND to_date(substring(timestampx,1,8), 'YYYYMMDD')  >= '%s'
            AND to_date(substring(timestampx,1,8), 'YYYYMMDD') <= '%s'
            group by host,devicepint,display_name,hh,mm 
            order by host,devicepint,hh,mm;'''

usermanage_table_Get = '''SELECT public."user".id, username, password, firstname, lastname, public."organization".name as organization
	FROM public."user" full outer join public."organization" on organization = public."organization".id 
	where public."user".id is not null
	order by public."user".id;'''

brandManage_get = '''SELECT * from public.cam_brand order by id '''
stream_sql = '''select stream_url from public.all_cameras where ip = '%s'; '''
OrganizationManage_get = '''SELECT * from public.organization order by id '''

insert_all = '''INSERT INTO public.all_cameras(
	ip, brand, model, camera_name, "user", password, auth_type, stream_url, location_name, latitude, longitude, "organization", manage_role,cam_type)
	VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', ARRAY%s,'%s');
 '''
login_map = '''SELECT camera_name, latitude, longitude,  public.cameras_type.type_name as cam_type
	FROM public.all_cameras full outer join public.cameras_type on cam_type = public.cameras_type.id
where public.all_cameras.id is not null order by public.all_cameras.id; '''

insert_log = ''' INSERT INTO public.log_action(
	user_id, action, time_stamp)
	VALUES (%s,'%s','%s'); '''