const express = require('express');
const router = express.Router()
const  Post = require('../models/Post')

router.get('' , async (req , res) => {

    try {

        const locals = {
            title: "NodeJs Blog",
            description:"Simple Blog Created With NodeJs, Express & MongoDB"
        }

        let perPage = 6;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{$sort:{createdAt: -1}}])
            .skip(perPage * page-perPage)
            .limit(perPage)
            .exec();

        const count = await Post.count();
        const nextPage = parseInt(page) +1;
        const hasNextPage = nextPage<= Math.ceil(count/perPage);

        res.render('index' , {
            locals,
            data,
            current: page,
            nextPage:hasNextPage?nextPage:null,
            currentRoute : '/'

        })
        // const data = await Post.find();

    }catch (error){
        console.log(error);
    }
})


//routes to get posts
router.get('/post/:id' , async (req , res) => {


    try {

        let slug = req.params.id;

        const data = await Post.findById({_id:slug});

        const locals = {
            title: data.title,
            description:"Simple Blog Created With NodeJs, Express & MongoDB",
            currentRoute: `/post/${slug}`
        }
        let currentRoute;
        res.render('post' , {locals , data , currentRoute})
    }catch (error){
        console.log(error);
    }
})
// function insertPostData() {
//     Post.insertMany([
//         {
//         title: "Building A Blog",
//         body:"This is the body txt"
//     },
//         {
//             title: "Title2",
//             body:"This is the body txt2"
//         },
//         {
//             title: "Title3",
//             body:"This is the body txt3"
//         },
//         {
//             title: "Title4",
//             body:"This is the body txt4"
//         },
//         {
//             title: "Title5",
//             body:"This is the body txt5"
//         },
//         {
//             title: "Title6",
//             body:"This is the body txt6"
//         },
//         {
//             title: "Title7",
//             body:"This is the body txt7"
//         },
//     ])
// }
// insertPostData();

//post route
router.post('/search' , async (req , res) => {


    try {

        const locals = {
            title: "Search",
            description:"Simple Blog Created With NodeJs, Express & MongoDB"
        }


        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"")

        const data = await Post.find({
            $or:[{
                title:{$regex:new RegExp(searchNoSpecialChar, 'i')}},
                {body:{$regex:new RegExp(searchNoSpecialChar, 'i')}
            }]
        });


        res.render("search" , {
            data,
            locals
        });
    }catch (error){
        console.log(error);
    }
})




router.get('/about' , (req , res) => {
    res.render('about',
        {currentRoute: '/about'}
        )
})

router.get('/contact' , (req , res) => {
    res.render('contact' , {currentRoute: '/contact'})
})


module.exports = router