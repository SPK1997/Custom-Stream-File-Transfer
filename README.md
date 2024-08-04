### CUSTOM STREAM TO TRANSFER FILE
**What does this project do ?**
- This project takes any file present in Source folder and copy the content of the file to another file in Destination folder.
- This project explores the concept of buffer, stream and file handling in node.js
- There is a CustomStreams folder in the project.
- This folder contains two javascript files implementing a read stream class and a write stream class.
- Node.js already provides file read stream and file write stream to read from and write to files. These are present under fs module which is a core module of node.js
- But this project shows the implementation of custom stream class to get a deeper understanding of the concept.

**An analogy to understand working of this project**
- In this project I have created streams and buffers and handled copying of file content from source to destination.
- Let us say I try to copy greet1.txt (size: 7GB) to greet2.txt (size: 0KB).
- Consider greet1.txt and greet2.txt files as two lakes.
    (a) greet1.txt has a lot of water (around 7GB)
    (b) greet2.txt has no water (0KB)
- consider a stream as taking water in a bucket (buffer) from greet1.txt lake and put it in greet2.txt lake. In this way we get to put all data from greet1.txt to greet2.txt
- Now one might ask why cannot I make the bucket (buffer) size as big as the lake and directly take all the water from lake ? The reason is Node.js program is a process and any process will use RAM for allocating memory in run time. So the bucket in our case or the buffer is a part of memory from RAM we allocate to store binary data which is file content in our case.
- The size of greet1.txt lake is around 7GB and suppose my laptop RAM is 8GB in size so if I make a bucket or buffer as big as greet1.txt then my laptop will be done for good🙂
- The memory restriction of a system is why we keep our bucket size small.

**How to use the project ?**
- Make sure node.js is installed in your system. <a href="https://nodejs.org/en/download/prebuilt-installer" target="_blank">Installation Link</a>
- There is a Source folder and a Destination folder in the project. 
- For now there will be a source.txt file present in Source folder and a destination.txt file present in Destination folder. Delete them if you want to.
- Put any file you want to copy to Destination folder inside Source folder. The file size can be anything. The file type can be anything.
- There is a .env file in project.
- In .env file mention the values for variables SOURCE_FILE and DESTINATION_FILE. The values have to contain the file name and its extension.
    Eg:- source.txt
- In .env whatever source file name you mention that file has to be present in Source folder.
- In .env whatever destination file name you mention that file will be created in Destination folder and will have contents of source file copied to it.
- Open the command prompt from the root of the project folder.
- Type the command 'npm install' and press enter. Wait for it to complete.
- Type the command 'npm start' and press enter. Wait for it to complete.
- Go to Destination folder and you will find that the file has been transferred.

**Want to create a large text file in Source folder of project ?**
- If not already done then make sure node.js is installed in your system. <a href="https://nodejs.org/en/download/prebuilt-installer" target="_blank">Installation Link</a>
- If not already done then open the command prompt from the root of the project folder.
- Type the command 'npm run createFile' and press enter. Wait for it to complete.
- Go to Source folder and you will find that file has been created.

**How is a read stream class implemented ?**
- Suggest to check the customReadStream.js file on the side while the below explanation is read.
- It is a normal javaScript class that inherits from Readable class.
- It has 4 methods:-
    (a) constructor:
    In this method the parent class constructor is called. Then the parent class constructor will initialize a buffer that the read stream will use. Its size is 64KB by default. This size value can be accessed by readableHighWaterMark property. You can change it by passing appropriate options to parent constructor.

    (b) _construct:
    This method will take a callback function as paramter. In this method we open the file we want to read from. Then we call the callback function. If we call the callback function with error then the _destroy method (point (d)) will be called and the _destroy method will take the error object and another callback function as its parameter. The _destroy method will call its callback function with the error object which in turn will emit two events 'error' and 'close'. These events can be subscribed to using the read stream class instance.

    (c) _read:
    This method will take a size value as parameter. This size value is nothing but the size of buffer that is created in constructor method. Using this buffer binary data is read from a file. The buffer is then pushed to the queue of read stream using the push method. This will in turn emit a event 'data'. This event can be subscribed to using the read stream class instance. On subscribing to this event we will get the buffer that was pushed. When reading from a file is finished then null is pushed to the queue of read stream using the push method. This will in turn emit a event 'end'. This event can be subscribed to using the read stream class instance. If anything goes wrong in _read method then the destroy method is called with error object which will emit two events 'error' and 'close' as explained in point (b). These events can be subscribed to using the read stream class instance.

    (d) _destroy:
    This method will take an error object and callback function as paramater. The _destroy method is called either when destroy method is called on the instance of a read stream class or when callback function of the _construct method (point (b)) is called with some error. In _destroy method we call the callback function and close file handlers if any opened. If the callback function is called without any error object or error object is null then one event will emit named 'close' and if the callback function is called with some error object then two events will emit named 'error' and 'close'.

**How is a write stream class implemented ?**
- Suggest to check the customWriteStream.js file on the side while the below explanation is read.
- It is a normal javaScript class that inherits from Writable class.
- It has 4 methods:-
    (a) constructor:
    In this method the parent class constructor is called. Then the parent class constructor will initialize a buffer size. By default it will be 16KB. This size value can be accessed by writableHighWaterMark property. You can change it by passing appropriate options to parent constructor.

    (b) _construct:
    This method will take a callback function as paramter. In this method we open the file we want to write to. Then we call the callback function. If we call the callback function with error then the _destroy method (point (d)) will be called and the _destroy method will take the error object and another callback function as its parameter. The _destroy method will call its callback function with the error object which in turn will emit two events 'error' and 'close'. These events can be subscribed to using the write stream class instance.

    (c) _write:
    This method will be called when write method is called on instance of write stream class. This method will take 3 parameters: chunk, encoding and callback function. Here chunk can be a buffer with binary data or a string. If the chunk is a string then encoding has to be provided so that the string can be converted to binary data and stored in a buffer. In _write method we write to the file using the buffer. Then we call the callback function. If we call the callback function of _write method with error then the _destroy method (point (d)) will be called and the _destroy method will take the error object and another callback function as its parameter. The _destroy method will call its callback function with the error object which in turn will emit two events 'error' and 'close'. These events can be subscribed to using the write stream class instance. If we call the callback function of _write method without error then a 'drain' event may be emitted. The condition for the 'drain' event is that the chunk size is greater than the buffer size that is initialized in constructor method (point (a)). 
    
    In _write method we can create a buffer from chunk paramater if chunk is a string. Also chunk paramater may be a buffer.Then what is the point of buffer size in constructor method if we are not using it in _write method ? The reason is in _write method we can create buffer of any size so keeping in mind the memory restriction of a system if our created buffer size exceeds the 16KB (default) mark set by constructor method some event has to be emitted so that it can signal that hey we have already exceed the set mark so wait until this buffer is emptied out and written to a file and then create another buffer. This event is named 'drain'

    (d) _destroy:
    This method will take an error object and callback function as paramater. The _destroy method is called under 3 conditions: when destroy method is called on the instance of a write stream class or when callback function of the _construct method (point (b)) is called with some error or when the callback function of the _write method (point (c)) is called with some error. In _destroy method we call the callback function and close file handlers if any opened. If the callback function is called without any error object or error object is null then one event will emit named 'close' and if the callback function is called with some error object then two events will emit named 'error' and 'close'.

**How to use the read stream class and write stream class ?**
Code:-
    
    // mention the filename in input option
    // file will be looked for in Source folder
    const rs = new ReadStream({ filename: process.env.SOURCE_FILE });

    // mention the filename in input option
    // file will be created in destination folder
    const ws = new WriteStream({ filename: process.env.DESTINATION_FILE });

    // subscribe to data event on read stream to get binary data from read stream in form of buffer
    // Then write the data to write stream.
    // The write method of write stream returns false and emits 'drain' event if the chunk size is higher that writableHighWater mark.
    // So we pause reading from read stream.
    rs.on('data', chunk => {
        if (!ws.write(chunk)) {
            rs.pause();
        }
    });

    // subscribe to end event on read stream to know when read stream has completed reading
    // Then destory both read stream and write stream.
    rs.on('end', () => {
        console.log('file transfer completed');
        rs.destroy();
        ws.destroy();
    });

    // subscribe to drain event on write stream 
    // This is to know when the write stream has completed writing and then resume the read stream.
    ws.on('drain', () => {
        rs.resume();
    });

    // subscribe to error event on read stream to be notified if something goes wrong.
    rs.on('error', () => {
        console.log('Error in reading data from file. Tip: Make sure file is present in Source folder');
    });

    // subscribe to error event on write stream to be notified if something goes wrong.
    ws.on('error', () => {
        console.log('Error in writing data to a file.');
    });


**Node.js documentation links:-**<br/>
<a href="https://nodejs.org/docs/latest/api/buffer.html">Buffer</a><br/>
<a href="https://nodejs.org/docs/latest/api/fs.html">File handling</a><br/>
<a href="https://nodejs.org/docs/latest/api/stream.html">Stream</a><br/>

**Article link:-**<br/>
<a href="https://medium.com/@smrutisagarpattanaik1997/node-js-buffers-navigating-binary-data-6a997b0a5c22">Buffer</a><br/>









