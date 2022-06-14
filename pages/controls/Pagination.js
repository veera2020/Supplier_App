/*
 *  Document    : Pagination.js
 *  Author      : uyarchi
 *  Description : Pagination for table
 */
import { Button } from "@chakra-ui/react";
import {
  FiChevronsRight,
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const Pagination = (props) => {
  if (props.totalRecord >= 0) {
    return <PaginationDom values={props} />;
  } else {
    return null;
  }
};

const PaginationDom = ({ values }) => {
  const {
    currentPage = 1,
    setCurrentPage,
    setShowLimit,
    showLimit,
    totalRecord = 0,
  } = values;

  const currentPageCount =
    parseInt(parseInt(currentPage - 1) * parseInt(showLimit)) +
    parseInt(showLimit);

  const disableNext = currentPageCount >= totalRecord;

  return (
    <>
      <div className="w-full px-4 py-1 flex justify-end space-x-2 bg-gray-100">
        <div className="flex place-items-center items-center space-x-1 text-right">
          <Button
            size="xs"
            title="First"
            className="bg-gray-50"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <FiChevronsLeft color="#454545" />
          </Button>
          <Button
            size="xs"
            title="Previous"
            className="bg-gray-50"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FiChevronLeft color="#454545" />
          </Button>
          <Button size="xs" title="Page Number" className="bg-gray-50 text-xs">
            {/* <span>{currentPage}</span> */}
            <span>
              Page {currentPage} of {(Math.ceil(totalRecord/10))}
            </span>
          </Button>
          <Button
            size="xs"
            title="Next"
            className="bg-gray-50"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={disableNext}
          >
            <FiChevronRight color="#454545" />
          </Button>
          <Button
            size="xs"
            title="Last"
            className="bg-gray-50"
            onClick={() => setCurrentPage(Math.ceil(totalRecord / showLimit))}
            disabled={disableNext}
          >
            <FiChevronsRight color="#454545" />
          </Button>
          {/* <select
          className="cursor-pointer text-xs focus:outline-none"
          onChange={(e) =>
            setShowLimit(() => {
              setCurrentPage(1);
              return e.target.value;
            })
          }
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select> */}
        </div>
      </div>
    </>
  );
};

export default Pagination;
