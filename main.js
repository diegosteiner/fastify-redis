const fastify = require('fastify')({ logger: true });
const redis = require('fastify-redis');

// fastify.register(redis, {
// 	host: 'localhost', // Redis server host
// 	port: 6379,        // Redis server port
// });

fastify.register(require('@fastify/formbody'))
fastify.register(require("@fastify/view"), {
	engine: {
		ejs: require("ejs"),
	},
});

let posts = [
	{ id: 1, text: 'This is the first post.' },
	{ id: 2, text: 'Another post here.' },
];

fastify.get("/", (request, response) => {
	response.view("/index.ejs", { posts: posts });
});

fastify.get('/posts', async (request, response) => {
	try {
		// const postsFromRedis = await fastify.redis.get('posts');
		// const parsedPosts = postsFromRedis ? JSON.parse(postsFromRedis) : posts;
		parsedPosts = posts
		response.send({ posts: parsedPosts });
	} catch (error) {
		response.status(500).send({ error: 'Internal Server Error' });
	}
});

// POST route to add a new post to Redis
fastify.post('/posts', async (request, response) => {
	try {
		const newPost = { id: posts.length + 1, text: request.body.text };
		posts.push(newPost);

		// Update the posts in Redis
		// await fastify.redis.set('posts', JSON.stringify(posts));
		response.redirect('/')

		// response.send({ success: true, post: newPost });
	} catch (error) {
		response.status(500).send({ error: 'Internal Server Error' });
	}
});

fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
	// Server is now listening on ${address}
})
