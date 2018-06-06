from flask import Flask, render_template, jsonify
import tweepy
import pymysql.cursors

connection  = pymysql.connect(host='localhost', port=3310, user='root', passwd='ahmad1991', db='test', charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)

app = Flask(__name__, static_folder='./static/dist', template_folder='./static')
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

consumer_key = "wLK2TEfZqoWsbme3nTvL5VkMu"
consumer_secret = "j1wDBj8ehfglecohd0ZzIodpRjWMChx91ztnAnOyNEddew6CYx"
access_token = "1004016501416976384-CyNUvOUlGJ0V362pPAvV7nvW6o5qIJ"
access_token_secret = "YayhLW5Z4skFa7g8iX3E4zY1bjh1EHviU5b9bbrl2XnU5"

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth,wait_on_rate_limit=True)
public_tweets = api.home_timeline(count=200)

# helper function to save into database
def test(text, user):
    try:
        with connection.cursor() as cursor:
            sql = "INSERT INTO `twitter3` (`user`, `text`) VALUES (%s, %s)"
            cursor.execute(sql, (user, text))
        connection.commit()
    finally:
        return

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/hello")
def hello():
	for x in public_tweets:
		test(x.text.encode('utf-8'),x.user.name.encode('utf-8'))

@app.route("/tweet")
def tweet():
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM `twitter3`"
            cursor.execute(sql)
            result = cursor.fetchall()
            return jsonify(customers=result)   
    finally:
        return jsonify(customers=result) 

@app.route("/dtweet")
def dtweet():
    try:
        with connection.cursor() as cursor:
            sql = "TRUNCATE TABLE `twitter3`"
            cursor.execute(sql)
    finally:
        return 'deleted'

if __name__ == "__main__":
	app.run(use_reloader=True)
	
# First we need to create table with
# CREATE DATABASE database_name
# Then create table with following code in database shell    
# 	CREATE TABLE `twitter3` (
#     `id` int(11) NOT NULL AUTO_INCREMENT,
#     `user` varchar(255) COLLATE utf8mb4_bin NOT NULL,
#     `text` varchar(255) COLLATE utf8mb4_bin NOT NULL,
#     PRIMARY KEY (`id`)
# ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
# AUTO_INCREMENT=1 ;