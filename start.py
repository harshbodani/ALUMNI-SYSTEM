from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from flask_bcrypt import Bcrypt
from flask_mysqldb import MySQL
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

# Enable CORS
CORS(app)  # This will allow all origins to access the backend

bcrypt = Bcrypt(app)

app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

# MySQL Config
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'AlumniPortal'
mysql = MySQL(app)


# Registration Route
@app.route('/register', methods=['POST'])
def register():
    data = request.json  # Get the JSON data sent from the frontend
    print("Received Data:", data)  # Log the received data to the console

    # Get values from the received JSON
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    expertise = data.get('expertise', '')  # Default to an empty string if expertise is not provided

    if not name or not email or not password or not role:
        return jsonify({"error": "Name, email, password, and role are required!"}), 400

    # Hash the password
    

    # Insert user into the database
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO Users (name, email, password, role, expertise, status) 
            VALUES (%s, %s, %s, %s, %s, 'pending')
        """, (name, email, password, role, expertise))
        mysql.connection.commit()
        return jsonify({"message": "Registration successful!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/pending-registrations', methods=['GET'])
def pending_registrations():
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, name, email FROM Users WHERE status = 'pending'")  # Fetch only pending registrations
    result = cur.fetchall()
    
    registrations = []
    for row in result:
        registrations.append({
            'id': row[0],
            'name': row[1],
            'email': row[2]
        })
    
    return jsonify(registrations)

@app.route('/approve-registration/<int:user_id>', methods=['POST'])
def approve_registration(user_id):
    cur = mysql.connection.cursor()
    try:
        cur.execute("UPDATE Users SET status = 'approved' WHERE id = %s", (user_id,))
        mysql.connection.commit()
        return jsonify({"message": "Registration approved"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/reject-registration/<int:user_id>', methods=['POST'])
def reject_registration(user_id):
    cur = mysql.connection.cursor()
    try:
        cur.execute("UPDATE Users SET status = 'rejected' WHERE id = %s", (user_id,))
        mysql.connection.commit()
        return jsonify({"message": "Registration rejected"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/login', methods=['POST'])
def login():
    
    data = request.json
    email = data.get('email')
    password = data.get('password')

    cur = mysql.connection.cursor()
    cur.execute("SELECT *FROM users WHERE email = %s AND password = %s", (email, password))  # Fetch only pending registrations
    result = cur.fetchone()
    
    # Dummy authentication logic
    if email == result[2] and password == result[3]:
        return jsonify({"message": "Login Successful"}), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401

@app.route('/search-alumni', methods=['GET'])
def search_alumni():
    query = request.args.get('query')
    cur = mysql.connection.cursor()
    search_query = f"%{query}%"
    cur.execute("SELECT name, email, expertise FROM Users WHERE role='alumni' AND (name LIKE %s OR expertise LIKE %s)", (search_query, search_query))
    result = cur.fetchall()
    alumni = [{"name": row[0], "email": row[1], "expertise": row[2]} for row in result]
    return jsonify(alumni)

@app.route('/alumni-details', methods=['GET'])
def alumni_details():
    cur = mysql.connection.cursor()
    cur.execute("SELECT name, email, expertise, achievements FROM Users WHERE role='alumni'")
    result = cur.fetchall()
    alumni = [{"name": row[0], "email": row[1], "expertise": row[2], "achievements": row[3]} for row in result]
    return jsonify(alumni)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Create Post
@app.route('/post', methods=['POST'])
def create_post():
    data = request.json
    user_id = data.get('user_id')
    text = data.get('text')

    # Handle file upload
    if 'image' not in request.files:
        return jsonify({"message": "No image part"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Save post to the database
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO posts (user_id, text, image_url) VALUES (%s, %s, %s)", (user_id, text, filepath))
        mysql.connection.commit()
        cur.close()

        return jsonify({"message": "Post created successfully!"}), 201
    else:
        return jsonify({"message": "Invalid file type"}), 400

# Get All Posts (Feed)
@app.route('/posts', methods=['GET'])
def get_posts():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM posts ORDER BY created_at DESC")
    posts = cur.fetchall()
    cur.close()

    # Return posts with user information
    post_list = []
    for post in posts:
        cur.execute("SELECT name FROM users WHERE id = %s", (post[1],))  # Get user name
        user = cur.fetchone()
        post_list.append({
            'user_name': user[0],
            'text': post[2],
            'image_url': post[3],
            'created_at': post[4]
        })

    return jsonify(post_list)

if __name__ == '__main__':
    app.run(debug=True)
