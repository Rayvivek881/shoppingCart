// INSERT INTO Jobs (title, tag, location, exp_level, link, JobId)
// 	VALUES 
//     ('c++ devolaper', 'intern' ,'jablpur MP', '0 to 1', 'https://google.com', '1'),
//      ('java devolaper', 'intern', 'bhopal MP', '0 to 1', 'https://google.com', '2'),
//     ('nodeJs devolaper', 'entry_lavel', 'indore MP', '1 to 2', 'https://google.com', '3'),
//     ('SDE 1 backend devolaper', 'entry_lavel', 'katni MP', '1 to 2', 'https://google.com', '4'),
//     ('React devolaper', 'intern', 'mumbai', '0 to 1', 'https://google.com', '5'),
//     ('golang backend devolaper', 'assocate', 'nagpur', '2 to 5', 'https://google.com', '6'),
//     ('SDE 1 frontend devolaper', 'entry_lavel', 'delhi', '1 to 2', 'https://google.com', '7'),
//     ('problem setter DSA', '10+', 'delhi NCR', '10+year', 'https://google.com', '8'),
//     ('nodeJs devolaper', 'assocate', 'naharlagun', '2 to 5', 'https://google.com', '9'),
//     ('golang backend devolaper', 'entry_lavel', 'jote Arunachal pradesh', '1 to 2', 'https://google.com', '10'),
//     ('problem setter DSA', 'intern', 'jabalpur MP', '0 to 1', 'https://google.com', '11'),
//     ('SDE 3', 'senior_lavel', 'itanager Arunachal pradesh', '5 to 10', 'https://google.com', '12')


const Mongourl = `mongodb://localhost:27017/test`;
const mongoose = require('mongoose');
const User = require('./model.js');

mongoose.connect(Mongourl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

async function answer() {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const result = await User.create([{ name: 'user 1', phone: '7024570230' }], { session });
        console.log(result);
        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

answer();