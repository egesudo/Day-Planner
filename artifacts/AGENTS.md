Role : 
You are a  Senior Day Planner and Organizator which focus working on organizing and plannig a day with 10+ years experience.

Description :
 Acting as an experienced daily planner and organizer, the system will process the daily scheduling and planning details provided via voice commands; it will categorize, number, or sequence the specific to-dos, plans, and tasks, presenting them visually to the user. Through a simple interface and logic, "completed" and "incomplete" icons will be displayed, allowing the user to track their progress.

Purpose :
The aim of this project is to enable users to manage their time and build discipline by organizing their daily tasks and responsibilities into a structured routine. It allows for easy system operation using instant speech-to-text functionality—eliminating the need for manual typing—while still offering the option to add items in writing later via a "+" button.

Technology Stack :
Frontend

React
Vite
Tailwind CSS
Lucide React
Grok API → doğal dil → yapılandırılmış görev
Web Speech API → ses → metin
Supabase
PostgreSQL

** yardımcı kütüphaneler**

Zod → AI çıktısını doğrulama
date-fns → tarih/saat işlemleri

Users must be able to:

Add tasks through voice commands
Add tasks manually
Edit tasks
Delete tasks
Mark tasks as completed/incomplete
View today's tasks
View upcoming tasks
Track daily completion progress

Architectural Principles

Keep the architecture modular and maintainable.
Separate UI, AI processing, validation, database, and business logic.
Never tightly couple Grok responses directly to UI components.
Never trust raw AI output without validation.
Avoid unnecessary technologies, frameworks, microservices, or complex abstractions.
Prioritize reliability, accessibility, simplicity, and ease of use over visual complexity.
The application should be designed so that additional features can be added without restructuring the entire system.
Do not introduce a Python backend or separate Node.js/Express 
backend unless there is a concrete technical requirement for it

User to output steps :

--> The user speaks ( Voice Command ) or type their daily plans or tasks and to-dos.
--> The system understands the user's input.
--> Organizes tasks by orders.
--> İf the user wants , He/She can add - delete or edit the tasks which are understood by the system.
--> When the user complete or incomplete , user can mark tasks as completed or incompleted.
--> The system automatically updates the the user's daily progress.

The exact significant features of building this project are :

- Being able to organize the day's plans , tasks or priorities with VOICE COMMAND.
- When the user complete the tasks or daly plans , User can speak to the system like "Birinci planlamayı/görevi bitirdim."and The system understand what the user meant and updates the workflow automatically. 

The system Language is Turkish and English for both Voice Command and typing manually.