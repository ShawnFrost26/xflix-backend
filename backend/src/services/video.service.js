const httpStatus = require("http-status");
const { Video } = require("../models");
const ApiError = require("../utils/ApiError");

const getVideoById = async (id) => {
  const video = await Video.findById(id);
  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, "No video found with matching id");
  }
  return video;
};

const getRatingarray = async (rating) => {
  let ratings = ["Anyone", "7+", "12+", "16+", "18+"];
  if (rating == "All") return ratings;
  let i = ratings.indexOf(rating);
  console.log("sliced:", ratings.slice(i)) ;
  return ratings.slice(i);
};


const sortVideo = async (videos, sortBy) => {
  videos.sort((v1, v2) => {
    let a = v1[sortBy];
    let b = v2[sortBy];
    if (sortBy == "releaseDate") {
      a = new Date(a).valueOf();
      b = new Date(b).valueOf();
    }
    return b - a;
  });
  return videos;
};

const getVideos = async (title, genres, contentRating, sort) => {
  console.log("title:",title, "sort:",sort, "genres:",genres , "contentRating:", contentRating);
  const titlequery = { title: { $regex: title, $options: "i" } };
  let genrequery = { genre: { $in: genres } };
  if (genres == "All") genrequery = {};
  const ratingarray = await getRatingarray(contentRating);
  const ratingquery = { contentRating: { $in: ratingarray } };
  let videos = await Video.find({
    ...titlequery,
    ...genrequery,
    ...ratingquery,
  });
  const sortedvideos = await sortVideo(videos, sort);
  return sortedvideos;
};

const addVideo = async (video) => {
  const result = await Video.create(video);
  return result;
};

const changeVote = async (id, vote, change) => {
  const video = await Video.findById(id);
  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, "No video found with matching id");
  }
  if (vote == "upVote") {
    if (change == "increase") video.votes.upVotes += 1;
    else {
      video.votes.upVotes -= 1;
      video.votes.upVotes = Math.max(video.votes.upVotes, 0);
    }
  } else {
    if (change == "increase") video.votes.downVotes += 1;
    else {
      video.votes.downVotes -= 1;
      video.votes.downVotes = Math.max(video.votes.downVotes, 0);
    }
  }
  await video.save();
};

const changeView = async (id) => {
  const video = await Video.findById(id);
  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, "No video found with matching id");
  }
  video.viewCount += 1;
  await video.save();
};

module.exports = {
  getVideoById,
  getVideos,
  addVideo,
  changeVote,
  changeView,
};
