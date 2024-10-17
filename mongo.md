### Encountered Error:
`The $changeStream stage is only supported on replica sets`

You need to set up the mongoDb server and enable the "replica set" : https://www.mongodb.com/docs/manual/tutorial/convert-standalone-to-replica-set/


```Steps

1. Open CMD and run "mongosh"
2. Run "use admin" and "db.adminCommand({shutdown: 1, comment: "Convert to cluster"})"
3. Go to "mongo.conf" file located at /ProgramFiles/mongoDB/Server/7.0/bin and then open on text editor.
4. Then add:

    ` replication:
        replSetName: "rs0" `

5. Change the bindIp to "localhost"
6. Then start the mongodb using this command "net start MongoDB"
7. Run "mongosh" to cmd
8. Initiate the change using the command "rs.initiate()" NOTE: this should be done only ONCE.
9. To check if everything is fine, run command "rs.status()"

```