import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';

const Schema = mongoose.Schema;

const hwItemProgressSchema = new Schema({
	itemId: {
		type : mongoose.Types.ObjectId,
		ref: 'Homework.items'
	},
	done: {
		type: Boolean,
		default: false
	}
});

const hwProgressSchema = new Schema({
	hwId: {
		type : mongoose.Types.ObjectId,
		ref: 'Homework'
	},
	done: {
		type: Boolean,
		default: false
	}
});

const lessonProgressSchema = new Schema({
	lessonId: {
		type : mongoose.Types.ObjectId,
		ref: 'Lesson'
	},
	watched: {
		type: Boolean,
		default: false
	},
	checkedIn: {
		type: Boolean,
		default: false
	},
});

const userSchema = new Schema({
	// username and password are handled automatically by passport local mongoose
	verified: {type: Boolean, default: false},
	hasPassword: {type: Boolean, default: true},
	admin: {type: Boolean, default: false},
	googleId: String,
	googleToken: String,
	githubId: String,
	githubToken: String,
	lessonProgress: [lessonProgressSchema],
	hwProgress: [hwProgressSchema]
});


userSchema.statics.toggleWatched = async function(lessonId, userId) {
	const user = await this.findById(userId);
	let lesson = user.lessonProgress.find(lesson => {
		return lesson.lessonId.toString() === lessonId
	});
	
	if (lesson) {
		lesson.watched = !lesson.watched;
	} else {
		lesson = { lessonId, watched: true, checkedIn: false };
		user.lessonProgress.push(lesson);
	}
	await user.save();
}


userSchema.statics.toggleCheckedIn = async function(lessonId, userId) {
	const user = await this.findById(userId);
	let lesson = user.lessonProgress.find(lesson => {
		return lesson.lessonId.toString() === lessonId
	});
	
	if (lesson) {
		lesson.checkedIn = !lesson.checkedIn;
	} else {
		lesson = { lessonId, watched: false, checkedIn: true };
		user.lessonProgress.push(lesson);
	}
	await user.save();
}


userSchema.plugin(passportLocalMongoose);
export default mongoose.model('User', userSchema);
