const express = require("express");
const express_graphql = require("express-graphql");
const { buildSchema } = require("graphql");
const { coursesData } = require("./__mocks");

// GraphQL Schema
const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    }
    type Mutation {
      updateCourseTopic(id: Int!, topic: String!): Course
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

const getCourse = (args) => {
  const id = args.id;
  return coursesData.filter((course) => {
    return course.id == id;
  })[0];
};

const getCourses = (args) => {
  if (args.topic) {
    const topic = args.topic;
    return coursesData.filter((course) => course.topic === topic);
  } else return coursesData;
};

const updateCourseTopic = ({ id, topic }) => {
  coursesData.map((course) => {
    if (course.id == id) course.topic = topic;
    return course;
  });
  return coursesData.filter((course) => course.id == id)[0];
};

// Root Resolver
const root = {
  course: getCourse,
  courses: getCourses,
  updateCourseTopic: updateCourseTopic,
};

// Create an Express server and GraphQL endpoint
const app = express();
app.use(
  "/graphql",
  express_graphql({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4000, () =>
  console.log("GraphQL server now running on localhost:4000/graphql")
);
