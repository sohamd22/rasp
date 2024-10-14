import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
    content: String,
    expirationDate: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});
// Create the TTL index
statusSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 });

const Status = mongoose.model("Status", statusSchema);

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    photo: String,
    about: {
        dateOfBirth: Date,
        gender: String,
        campus: String,
        standing: String,
        major: String,
        skills: [String],
        hobbies: [String],
        socials: [String],
        bio: String,
    },
    statusId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Status"
    },
    embedding: []
});

userSchema.statics.vectorSearch = function(queryVector, limit = 10) {
    return this.aggregate([
      {
        $vectorSearch: {
          index: "vector_index", // replace with your actual index name
          queryVector: queryVector,
          path: "embedding",
          limit: limit,
          numCandidates: 100,
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          photo: 1,
          about: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ]);
  };

const User = mongoose.model("User", userSchema);

export { User, Status };