import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import {
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
interface PaginationProps {
  total_page: number; // Total number of pages
  index: number; // Current page index (starts from 0)
  step: number;
  onPageChange: (newIndex: number) => void; // Callback for page change
  sizePerPageList: {
    text: string;
    value: number;
  }[];
  onStepChange: (newStep: number) => void;
}

const Pagination = ({ total_page, index, step, onPageChange, sizePerPageList, onStepChange }: PaginationProps) => {
  const { t } = useTranslation();
  const [pageCount, setPageCount] = useState<number>(total_page);
  const [pageIndex, setPageIndex] = useState<number>(index);
  const [goIndex, setGoIndex] = useState<number>(index);
  const [pageStep, setPageStep] = useState<number>(step);

  useEffect(() => {
    setPageCount(total_page);
    setPageIndex(index);
    setGoIndex(index);
    setPageStep(step);
  }, [total_page, index, step]);

  /**
   * Compute the visible pages
   */
  const getVisiblePages = useCallback(
    (page: number | null, total: number) => {
      if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
      } else {
        if (page && page > 4 && page + 2 < total) {
          return [1, page - 1, page, page + 1, total];
        } else if (page && page + 2 >= total) {
          return [1, total - 3, total - 2, total - 1, total];
        } else {
          return [1, 2, 3, 4, 5, total];
        }
      }
    },
    []
  );

  const [visiblePages, setVisiblePages] = useState<number[]>(
    getVisiblePages(null, total_page)
  );

  useEffect(() => {
    setVisiblePages(getVisiblePages(pageIndex + 1, total_page));
  }, [pageCount, pageIndex, getVisiblePages, total_page]);

  /**
   * Handle page change
   */
  const changePage = (page: number) => {
    if (page === pageIndex) return;

    setPageIndex(page); // Update local state
    onPageChange(page); // Notify parent of the change
  };

  const changeStep = (s: number) => {
    setPageStep(s)
    onStepChange(s)
  }

  const activePage = pageIndex;

  return (
    <div className="d-lg-flex align-items-center text-center pb-1">
      <div className="d-lg-flex align-items-center text-center pb-1">
        {sizePerPageList.length > 0 && (
          <div className="d-inline-block me-3">
            <label className="me-1">{t("Display_t")}</label>
            <select
              value={pageStep}
              onChange={(e: any) => {
                changeStep(Number(e.target.value));
              }}
              className="form-select d-inline-block w-auto"
            >
              {(sizePerPageList || []).map((pageSize, index) => {
                return (
                  <option key={index} value={pageSize.value}>
                    {pageSize.text}
                  </option>
                );
              })}
            </select>
          </div>
        )}
        <span className="d-flex align-items-center my-sm-0 my-2">
          <label className="form-label me-2">{t("Go_to_page")}</label>
          <div className="d-flex align-items-center">
            <Form.Group>
              <InputGroup>
                <input
                  type="number"
                  value={goIndex}
                  min="1"
                  onChange={(e: any) => {
                    const page = e.target.value ? Number(e.target.value) : 1;
                    setGoIndex(page);
                  }}
                  className="form-control w-auto ms-1"
                  style={{ maxWidth: '80px' }} // Ajuste la largeur pour qu'elle soit plus petite
                />
                <Button
                  variant="dark"
                  id="button-addon2"
                  onClick={() => onPageChange(goIndex)}

                >
                  <i className="bi bi-box-arrow-in-right"></i> {/* Icône Bootstrap */}
                </Button>
              </InputGroup>
            </Form.Group>
          </div>
        </span>
      </div>



      <ul className="pagination pagination-rounded d-inline-flex ms-auto align-items-center mb-0">
        <li
          className={classNames("page-item", "paginate_button", "previous", {
            disabled: activePage === 1,
          })}
          onClick={() => activePage > 1 && changePage(activePage - 1)}
        >
          <Link to="#" className="page-link">
            <i className="mdi mdi-chevron-left"></i>
          </Link>
        </li>
        {visiblePages.map((page, index, array) => (
          <React.Fragment key={page}>
            {index > 0 && array[index - 1] + 1 < page && (
              <li className="page-item disabled">
                <Link to="#" className="page-link">
                  ...
                </Link>
              </li>
            )}
            <li
              className={classNames("page-item", {
                active: activePage === page,
              })}
              onClick={() => changePage(page)}
            >
              <Link to="#" className="page-link">
                {page}
              </Link>
            </li>
          </React.Fragment>
        ))}
        <li
          className={classNames("page-item", "paginate_button", "next", {
            disabled: activePage === total_page,
          })}
          onClick={() => activePage < total_page && changePage(activePage + 1)}
        >
          <Link to="#" className="page-link">
            <i className="mdi mdi-chevron-right"></i>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
