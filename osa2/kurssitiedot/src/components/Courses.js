const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p><b>total of {sum} exercises</b></p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  parts.map(part => 
    <Part key={part.id} part={part} />
  )

const Course = ({course, parts}) =>
  <div>
    <Header course={course} />
    <Content parts={parts} />
    <Total sum={parts.map(parts => parts.exercises).reduce((p, c) => p + c)} />
  </div>

const Courses = ({courses}) =>
  courses.map(cour =>
    <Course key={cour.id} course={cour.name} parts={cour.parts} />
  )

export default Courses