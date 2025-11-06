PASS **tests**/server.test.ts
Todo API Tests
GET /todos  
 √ should return all todos with sub_todos (20 ms)  
 √ should return 500 on database error (3 ms)  
 POST /todos  
 √ should create a new todo (13 ms)  
 √ should return 500 on database error (4 ms)  
 POST /sub_todos  
 √ should create a new sub_todo (3 ms)  
 DELETE /todos/:id  
 √ should delete a todo (2 ms)  
 √ should return 500 on database error (3 ms)  
 DELETE /sub_todos/:id  
 √ should delete a sub_todo (2 ms)  
 PUT /todos/:id  
 √ should update a todo (5 ms)  
 PUT /sub_todos/:id  
 √ should update a sub_todo (3 ms)

Test Suites: 1 passed, 1 total  
Tests: 10 passed, 10 total  
Snapshots: 0 total
Time: 0.545 s, estimated 1 s
