import { useState } from "react";
import "./pagination.scss";
const Pagination = ({ data, SkillsList, pageLimit, dataLimit, removeItem,openEditModal,editable }) => {
  const [pages] = useState(Math.round(data.length / dataLimit));
  const [currentPage, setCurrentPage] = useState(1);
  const goToNextPage = () => {
    setCurrentPage((page) => page + 1);
  };
  const goToPreviousPage = () => {
    setCurrentPage((page) => page - 1);
  };

  const changePage = (event) => {
    const pageNumber = Number(event.target.textContent);
    setCurrentPage(pageNumber);
  };

  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    return data.slice(startIndex, endIndex);
  };

  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    let maxPageNr = Math.ceil(data.length / dataLimit);
    if (maxPageNr < pageLimit)
      return new Array(maxPageNr).fill().map((_, idx) => start + idx + 1);
    return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
  };

  return (
    <div>
      {/* show the posts, x posts at a time */}
      <div className="dataContainer">
        {getPaginatedData().map((d, idx) => (
          <SkillsList key={idx} data={d} removeItem={removeItem} openEditModal={openEditModal}/>
        ))}
      </div>

      {/* show the pagiantion
          it consists of next and previous buttons
          along with page numbers, in our case, 5 page
          numbers at a time
      */}
      {data.length > 0 && (
        <div className="pagination">
          {/* previous button */}
          {data && (
            <button
              onClick={goToPreviousPage}
              className={`prev ${currentPage === 1 ? "disabled" : ""}`}
            >
              prev
            </button>
          )}

          {/* show page numbers */}
          {getPaginationGroup().map((item, index) => (
            <button
              key={index}
              onClick={changePage}
              className={`paginationItem ${
                currentPage === item ? "active" : null
              }`}
            >
              <span>{item}</span>
            </button>
          ))}

          {/* next button */}
          <button
            onClick={goToNextPage}
            className={`next ${currentPage === pages ? "disabled" : ""}`}
          >
            next
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
