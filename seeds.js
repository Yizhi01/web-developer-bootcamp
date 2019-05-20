const mongoose   = require("mongoose"),
      Campground = require("./models/campground"),
      Comment    = require("./models/comment");
      
const data = [
  {
    name: "Granite Hill",
    price: "20",
    image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id odio ligula. Pellentesque mollis elit nisl, sit amet posuere est ultricies non. Donec sagittis nulla a mi bibendum, quis aliquam orci blandit. Pellentesque a dapibus sem. Suspendisse pharetra tellus et efficitur commodo. Phasellus nec gravida ex. Fusce sagittis mauris nisi, vehicula vehicula risus accumsan sed. Quisque id mauris a risus semper aliquet nec at nisi. Donec fermentum fringilla sapien id efficitur. Integer luctus augue quis tempor commodo. Aliquam erat volutpat. Donec suscipit auctor sem eu porta.  ",
    author:{
      id: "5cc67ee0fc3d1e0f1b00e4dc",
      username: "Anne"
    }
    
  },
  {
    name: "Lake Lay",
    price: "30",
    image: "https://images.unsplash.com/photo-1484960055659-a39d25adcb3c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id odio ligula. Pellentesque mollis elit nisl, sit amet posuere est ultricies non. Donec sagittis nulla a mi bibendum, quis aliquam orci blandit. Pellentesque a dapibus sem. Suspendisse pharetra tellus et efficitur commodo. Phasellus nec gravida ex. Fusce sagittis mauris nisi, vehicula vehicula risus accumsan sed. Quisque id mauris a risus semper aliquet nec at nisi. Donec fermentum fringilla sapien id efficitur. Integer luctus augue quis tempor commodo. Aliquam erat volutpat. Donec suscipit auctor sem eu porta. ",
    author:{
      id:"5cd20fe311f8720ad9736675",
      username:"John"
    }
    
  },
  {
    name: "Forest Cabin",
    price: "50",
    image: "https://farm8.staticflickr.com/7285/8737935921_47343b7a5d.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id odio ligula. Pellentesque mollis elit nisl, sit amet posuere est ultricies non. Donec sagittis nulla a mi bibendum, quis aliquam orci blandit. Pellentesque a dapibus sem. Suspendisse pharetra tellus et efficitur commodo. Phasellus nec gravida ex. Fusce sagittis mauris nisi, vehicula vehicula risus accumsan sed. Quisque id mauris a risus semper aliquet nec at nisi. Donec fermentum fringilla sapien id efficitur. Integer luctus augue quis tempor commodo. Aliquam erat volutpat. Donec suscipit auctor sem eu porta.  ",
    author:{
      id:"5cc67ee0fc3d1e0f1b00e4dc",
      username:"Anne"
    }
    
  }
];

function seedDB(){
    
  //remove all campgrounds
  Campground.deleteMany({}, function(err){
    if(err){
      console.log(err);
    }
    console.log("removed all campgrounds");
    Comment.deleteMany({}, function(err) {
      if(err){
        console.log(err);
      }
      console.log("removed comments");
      //add a few campgrounds
      data.forEach(function(seed){
        Campground.create(seed, function(err, campground){
          if(err){
            console.log(err);
          }else{
            console.log("added a campground");
            //add a few comments
            Comment.create(
              {
                text:"This place is great, but I wish there was internet",
                author:{
                  id:"5cc67ee0fc3d1e0f1b00e4dc",
                  username:"Anne"
                }
              },function(err, comment){
                if(err){
                  console.log(err);
                }else{
                  campground.comments.push(comment);
                  campground.save();
                  console.log("created a comment");
                }
              }    
            );
          }
        });
      });
    });
  });
}


module.exports = seedDB;