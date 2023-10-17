import mongoose from 'mongoose';

const connectMongo = () => {
    console.log('connecting to mongodb...');

    const connect = mongoose.connect('mongodb://127.0.0.1:27017/test');

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', () => {
        console.log('connected to mongodb');
    });

    return connect;
};

export default connectMongo;