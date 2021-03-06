connection = psycopg2.connect(user=smartsafty_user,password=smartsafty_password,host=smartsafty_host,port=smartsafty_port,database=smartsafty_dbname)
        # cur = connection.cursor()