1. Open the fashion360-eai folder in any IDM (e.g., VS Code).
2. After opening it, go to the Terminal section to send the commands.
3. Currently the directory might be on Enterprise Application Integration folder. So, write "CD fashion360-eai" to go to the fashion360-eai folder inside the Enterprise Application Integration. Now there are several folder inside the fashion360-eai. You can run the "ls" command to see all others folders. Currently there are like .sql folder, frontend folder and another fashion360-eai folder which is the backend folder of this system. So, again type "CD fashion360-eai" to go inside the fashion360-eai backend folder. Now we're inside the Enterprise Application Integration\fashion360-eai\fashion360-eai directory and can proceed to run the necessary commands.
4. "pip install -r requirements.txt". "pip list"
5. 

uvicorn app.main:app --reload


After running, Your FastAPI backend is now running and waiting for requests at visit http://127.0.0.1:8000 in your browser to see your app.
You can open http://127.0.0.1:8000/health in your browser to check if the backend is healthy.
You can open http://127.0.0.1:8000/docs to see the API documentation.

connect your database using XAMPP (phpMyAdmin/MySQL)
A. Start MySQL in XAMPP:

Open XAMPP Control Panel.
Click Start next to MySQL.
B. Import your SQL file:

Open http://localhost/phpmyadmin in your browser.
Create a new database (e.g., fashion360).
Go to the Import tab, select your .sql file, and import it.

C. Update your FastAPI backend to use this database:

In your project, open the .env file (in the fashion360-eai directory).
Set the database URL, for example: DATABASE_URL=mysql+pymysql://root:password@localhost:3306/fashion360
Replace root and password with your MySQL username and password (default is root and blank password).
fashion360 is the database name you created.


3. How to run the frontend
Your frontend is in the fashion360-frontend folder.
You can open the HTML files directly in your browser (e.g., index.html or index.html).
The frontend will make API calls to your backend at http://127.0.0.1:8000.
4. How everything works together
Backend (FastAPI): Handles API requests, talks to the MySQL database.
Database (MySQL/XAMPP): Stores your data, accessed by the backend.
Frontend (HTML/JS): Runs in your browser, talks to the backend via API.
