import PeopleCard from './PeopleCard';

const PeopleList = ({ classId, student }) => {
  return (
    <div>
      {student?.length === 0 ? (
        <div className="errorMessage">No People Found</div>
      ) : (
        <>
          {student?.map((item) => (
            <PeopleCard
              key={item._id}
              id={item._id}
              classId={classId}
              avatar={item.avatar}
              name={item.name}
              email={item.email}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default PeopleList;
