const fastify = require('fastify')({ logger: true });
const redis = require('fastify-redis');

// fastify.register(require('@fastify/redis'), { url: process.env.REDIS_URL })
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

function getPosts() {
	return posts
	// const postsFromRedis = await fastify.redis.get('posts');
	// return postsFromRedis ? JSON.parse(postsFromRedis) : posts;
}

fastify.get("/", (request, response) => {
	response.view("/index.ejs", { posts: getPosts() });
});

fastify.get('/posts', async (request, response) => {
	try {
		response.send({ posts: getPosts() });
	} catch (error) {
		response.status(500).send({ error: 'Internal Server Error' });
	}
});

fastify.post('/posts', async (request, response) => {
	try {
		const posts = getPosts()
		const newPost = { id: posts.length + 1, text: request.body.text };
		posts.push(newPost);

		// await fastify.redis.set('posts', JSON.stringify(posts));
		response.redirect('/')

	} catch (error) {
		response.status(500).send({ error: 'Internal Server Error' });
	}
});

fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
