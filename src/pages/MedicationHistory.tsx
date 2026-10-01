import {

  useCallback,

  useEffect,

  useMemo,

  useState,

} from "react";

import { useNavigate } from "react-router-dom";

import {

  getMedicationHistory,

} from "../services/medicationHistoryService";

import type {

  MedicationHistory as MedicationHistoryRecord,

} from "../interfaces/medicationHistory.interface";

import { logoutUser } from "../services/authService";

export default function MedicationHistory() {

  const navigate = useNavigate();

  const getToday = () => {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(

      today.getMonth() + 1

    ).padStart(2, "0");

    const day = String(

      today.getDate()

    ).padStart(2, "0");

    return `${year}-${month}-${day}`;

  };

  const getSevenDaysAgo = () => {

    const date = new Date();

    date.setDate(date.getDate() - 6);

    const year = date.getFullYear();

    const month = String(

      date.getMonth() + 1

    ).padStart(2, "0");

    const day = String(

      date.getDate()

    ).padStart(2, "0");

    return `${year}-${month}-${day}`;

  };

  const [

    fromDate,

    setFromDate,

  ] = useState(getSevenDaysAgo);

  const [

    toDate,

    setToDate,

  ] = useState(getToday);

  const [

    appliedFromDate,

    setAppliedFromDate,

  ] = useState(getSevenDaysAgo);

  const [

    appliedToDate,

    setAppliedToDate,

  ] = useState(getToday);

  const [

    history,

    setHistory,

  ] = useState<

    MedicationHistoryRecord[]

  >([]);

  const [

    isLoading,

    setIsLoading,

  ] = useState(false);

  const [

    error,

    setError,

  ] = useState<string | null>(

    null

  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] =

  useState(false);

  const ITEMS_PER_PAGE = 10;

const [

  currentPage,

  setCurrentPage,

] = useState(1);

  const loadHistory = useCallback(

    async (

      from: string,

      to: string

    ) => {

      try {

        setIsLoading(true);

        setError(null);

        const result =

          await getMedicationHistory(

            from,

            to

          );

        setHistory(result);

      } catch (error) {

        console.error(

          "Failed to load medication history:",

          error

        );

        if (

          error instanceof Error &&

          error.message ===

            "UNAUTHORIZED"

        ) {

          setError(

            "Your session has expired. Please log in again."

          );

          return;

        }

        setError(

          error instanceof Error

            ? error.message

            : "Failed to load medication history."

        );

      } finally {

        setIsLoading(false);

      }

    },

    []

  );

  useEffect(() => {

    loadHistory(

      appliedFromDate,

      appliedToDate

    );

  }, [

    appliedFromDate,

    appliedToDate,

    loadHistory,

  ]);

  const handleApplyFilter =

    () => {

      if (!fromDate || !toDate) {

        setError(

          "Please select both From Date and To Date."

        );

        return;

      }

      if (fromDate > toDate) {

        setError(

          "From Date cannot be after To Date."

        );

        return;

      }

      setError(null);

      setCurrentPage(1);

      setAppliedFromDate(

        fromDate

      );

      setAppliedToDate(

        toDate

      );

    };

  const handleReset =

    () => {

      const defaultFrom =

        getSevenDaysAgo();

      const defaultTo =

        getToday();

      setFromDate(defaultFrom);

      setToDate(defaultTo);

      setCurrentPage(1);

      setAppliedFromDate(

        defaultFrom

      );

      setAppliedToDate(

        defaultTo

      );

    };

  const formatDate = (

    dateString: string

  ) => {

    const date = new Date(

      `${dateString}T00:00:00`

    );

    if (Number.isNaN(date.getTime())) {

      return dateString;

    }

    return new Intl.DateTimeFormat(

      "en-GB",

      {

        day: "2-digit",

        month: "short",

        year: "numeric",

      }

    ).format(date);

  };

  const formatLongDate = (

    dateString: string

  ) => {

    const date = new Date(

      `${dateString}T00:00:00`

    );

    if (Number.isNaN(date.getTime())) {

      return dateString;

    }

    return new Intl.DateTimeFormat(

      "en-US",

      {

        weekday: "long",

        day: "numeric",

        month: "long",

        year: "numeric",

      }

    ).format(date);

  };

  const formatTime = (

    timeString: string

  ) => {

    const parts =

      timeString.split(":");

    if (parts.length < 2) {

      return timeString;

    }

    const hour = Number(

      parts[0]

    );

    const minute = Number(

      parts[1]

    );

    if (

      Number.isNaN(hour) ||

      Number.isNaN(minute)

    ) {

      return timeString;

    }

    const date =

      new Date();

    date.setHours(

      hour,

      minute,

      0,

      0

    );

    return new Intl.DateTimeFormat(

      "en-US",

      {

        hour: "numeric",

        minute: "2-digit",

        hour12: true,

      }

    ).format(date);

  };

  const summary = useMemo(() => {

    const uniqueMedicines =

      new Set(

        history

          .filter(

            (item) =>

              item.medicineMatched &&

              item.medicineName

          )

          .map(

            (item) =>

              item.medicineName

          )

      );

    const uniqueDates =

      new Set(

        history.map(

          (item) => item.date

        )

      );

    const latest =

      history.length > 0

        ? history[0]

        : null;

    return {

      totalTaken:

        history.length,

      medicines:

        uniqueMedicines.size,

      activeDays:

        uniqueDates.size,

      latest,

    };

  }, [history]);

  const getMedicineStatusClass = (

    item: MedicationHistoryRecord

  ) => {

    if (!item.medicineMatched) {

      return "history-medicine-warning";

    }

    return "history-medicine-success";

  };

   const handleLogout = async () => {

      try {

        await logoutUser();

        navigate("/login", {

          replace: true,

        });

      } catch (err) {

        console.error(

          "Logout failed:",

          err

        );

        setError(

          "Logout failed. Please try again."

        );

      }

    };

  const totalPages = Math.ceil(

    history.length / ITEMS_PER_PAGE

  );

  const paginatedHistory = useMemo(() => {

    const startIndex =

      (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex =

      startIndex + ITEMS_PER_PAGE;

    return history.slice(

      startIndex,

      endIndex

    );

  }, [

    history,

    currentPage,

  ]);

  return (

    <div className="medication-history-page">

      {/* ================= HEADER ================= */}

     <header className="topbar">

        <div className="brand">

          <div className="brand-mark" aria-hidden="true">

            <img

              src="/medivo-logo.png"

              alt="Medivo"

            />

          </div>

          <div>

            <div className="brand-name">

              Medivo

            </div>

            <div className="brand-subtitle">

              Smart medicine box

            </div>

          </div>

        </div>

        <div className="topbar-actions">

          <div className="desktop-topbar-actions">

            <div className="connection-status">

              <span className="status-dot" />

              Box ready

            </div>

            <button

              type="button"

              className="medicine-history-button"

              onClick={() => navigate("/medication-history")}

            >

              Medicine History

            </button>

            <button

              type="button"

              className="medical-documents-button"

              onClick={() => navigate("/medical-documents")}

            >

              Medical Documents

            </button>

            <button

              type="button"

              className="profile-button"

              onClick={() =>

                navigate("/profile")

              }

            >

              Profile

            </button>

            <button

              type="button"

              className="logout-button"

              onClick={handleLogout}

            >

              Logout

            </button>

          </div>

          <button

            type="button"

            className="mobile-menu-button"

            aria-label={

              isMobileMenuOpen

                ? "Close menu"

                : "Open menu"

            }

            aria-expanded={isMobileMenuOpen}

            onClick={() =>

              setIsMobileMenuOpen(

                current => !current

              )

            }

          >

            <span />

            <span />

            <span />

          </button>

        </div>

      </header>

      {/* =====================================================

          MOBILE MENU

          ===================================================== */}

      {isMobileMenuOpen && (

        <>

          <div

            className="mobile-menu-overlay"

            onClick={() =>

              setIsMobileMenuOpen(false)

            }

          />

          <div

            className="mobile-menu"

            role="menu"

          >

            <div className="mobile-menu-status">

              <span className="status-dot" />

              <span>Box ready</span>

            </div>

            <button

              type="button"

              className="mobile-menu-item active"

              onClick={() => {

                setIsMobileMenuOpen(false);

                navigate("/medication-history");

              }}

            >

              <span className="mobile-menu-icon">

                💊

              </span>

              <span>

                Medicine History

              </span>

            </button>

            <button

              type="button"

              className="mobile-menu-item"

              onClick={() => {

                setIsMobileMenuOpen(false);

                navigate("/medical-documents");

              }}

            >

              <span className="mobile-menu-icon">

                📄

              </span>

              <span>

                Medical Documents

              </span>

            </button>

            <button

              type="button"

              className="mobile-menu-item"

              onClick={() => {

                setIsMobileMenuOpen(false);

                navigate("/profile");

              }}

            >

              <span className="mobile-menu-icon">

                ◯

              </span>

              <span>

                Profile

              </span>

            </button>

            <div className="mobile-menu-divider" />

            <button

              type="button"

              className="mobile-menu-item mobile-logout-item"

              onClick={async () => {

                setIsMobileMenuOpen(false);

                await handleLogout();

              }}

            >

              <span className="mobile-menu-icon">

                ↪

              </span>

              <span>

                Logout

              </span>

            </button>

          </div>

        </>

      )}

    <div className="medication-history-container">

      {/* Back to Dashboard */}

      <button

        type="button"

        className="back-to-dashboard-button"

        onClick={() => navigate("/dashboard")}

      >

        <span aria-hidden="true">←</span>

        Back to Dashboard

      </button>

      {/* Rest of your page */}

    </div>

  {/* ================= PAGE CONTENT ================= */}

      <div className="medication-history-container">

        {/* Page Header */}

        <div className="medication-history-header">

          <div className="medication-history-title-icon">

            💊

          </div>

          <div>

            <h1>

              Medicine History

            </h1>

            <p>

              View when medicines were

              taken from your Medivo

              medicine box.

            </p>

          </div>

        </div>

        {/* Filter Card */}

        <section className="medication-history-filter-card">

          <div className="history-filter-header">

            <div>

              <h2>

                History Period

              </h2>

              <p>

                Select a date range to

                view your medicine intake

                history.

              </p>

            </div>

          </div>

          <div className="history-filter-form">

            <div className="history-filter-field">

              <label htmlFor="history-from-date">

                From Date

              </label>

              <input

                id="history-from-date"

                type="date"

                value={fromDate}

                max={toDate}

                onChange={(event) =>

                  setFromDate(

                    event.target.value

                  )

                }

                disabled={isLoading}

              />

            </div>

            <div className="history-filter-field">

              <label htmlFor="history-to-date">

                To Date

              </label>

              <input

                id="history-to-date"

                type="date"

                value={toDate}

                min={fromDate}

                max={getToday()}

                onChange={(event) =>

                  setToDate(

                    event.target.value

                  )

                }

                disabled={isLoading}

              />

            </div>

            <div className="history-filter-actions">

              <button

                type="button"

                className="history-reset-button"

                onClick={handleReset}

                disabled={isLoading}

              >

                Reset

              </button>

              <button

                type="button"

                className="history-apply-button"

                onClick={

                  handleApplyFilter

                }

                disabled={isLoading}

              >

                {isLoading ? (

                  <>

                    <span className="history-button-spinner" />

                    Loading...

                  </>

                ) : (

                  "Apply Filter"

                )}

              </button>

            </div>

          </div>

        </section>

        {/* Error */}

        {error && (

          <div className="medical-document-error history-page-error">

            <span>!</span>

            <p>

              {error}

            </p>

          </div>

        )}

        {/* Selected Period */}

        {!error && (

          <div className="history-selected-period">

            <div>

              <span>

                Showing history from

              </span>

              <strong>

                {formatDate(

                  appliedFromDate

                )}

              </strong>

              <span>

                to

              </span>

              <strong>

                {formatDate(

                  appliedToDate

                )}

              </strong>

            </div>

            <span className="history-record-count">

              {history.length}{" "}

              {history.length === 1

                ? "record"

                : "records"}

            </span>

          </div>

        )}

        {/* Loading */}

        {isLoading ? (

          <div className="medication-history-loading">

            <span className="history-loading-spinner" />

            <p>

              Loading medicine history...

            </p>

          </div>

        ) : (

          <>

            {/* Summary */}

            {history.length > 0 && (

              <div className="history-summary-grid">

                <div className="history-summary-card">

                  <div className="history-summary-icon taken">

                    ✓

                  </div>

                  <div>

                    <span>

                      Medicines Taken

                    </span>

                    <strong>

                      {

                        summary.totalTaken

                      }

                    </strong>

                  </div>

                </div>

                <div className="history-summary-card">

                  <div className="history-summary-icon medicine">

                    💊

                  </div>

                  <div>

                    <span>

                      Different Medicines

                    </span>

                    <strong>

                      {

                        summary.medicines

                      }

                    </strong>

                  </div>

                </div>

                <div className="history-summary-card">

                  <div className="history-summary-icon days">

                    📅

                  </div>

                  <div>

                    <span>

                      Days With Intake

                    </span>

                    <strong>

                      {

                        summary.activeDays

                      }

                    </strong>

                  </div>

                </div>

              </div>

            )}

            {/* Empty State */}

            {history.length === 0 ? (

              <div className="medication-history-empty">

                <div className="history-empty-icon">

                  💊

                </div>

                <h3>

                  No Medicine History

                </h3>

                <p>

                  No medicine intake records

                  were found for the selected

                  date range.

                </p>

                <button

                  type="button"

                  className="history-empty-reset-button"

                  onClick={handleReset}

                >

                  View Last 7 Days

                </button>

              </div>

            ) : (

              <section className="medication-history-list">

                <div className="history-list-header">

                  <div>

                    <h2>

                      Medicine Intake

                    </h2>

                    <p>

                      Recorded medicine

                      intake from your

                      Medivo box.

                    </p>

                  </div>

                </div>

                {/* Desktop Table */}

                <div className="history-table-wrapper">

                  <table className="history-table">

                    <thead>

                      <tr>

                        <th>

                          Date

                        </th>

                        <th>

                          Time

                        </th>

                        <th>

                          Medicine

                        </th>

                        <th>

                          Compartment

                        </th>

                        <th>

                          Status

                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {paginatedHistory.map(

                        (item) => (

                          <tr

                            key={

                              item.id

                            }

                          >

                            <td>

                              <div className="history-date-cell">

                                <strong>

                                  {formatDate(

                                    item.date

                                  )}

                                </strong>

                              </div>

                            </td>

                            <td>

                              <span className="history-time">

                                {formatTime(

                                  item.time

                                )}

                              </span>

                            </td>

                            <td>

                              <div className="history-medicine-cell">

                                <div className="history-medicine-icon">

                                  💊

                                </div>

                                <div>

                                  <strong

                                    className={

                                      getMedicineStatusClass(

                                        item

                                      )

                                    }

                                  >

                                    {

                                      item.medicineName

                                    }

                                  </strong>

                                  {!item.medicineMatched && (

                                    <small>

                                      Medicine could

                                      not be matched

                                    </small>

                                  )}

                                </div>

                              </div>

                            </td>

                            <td>

                              <span className="history-compartment">

                                {

                                  item.compartmentId

                                }

                              </span>

                            </td>

                            <td>

                              <span

                                className={

                                  item.medicineMatched

                                    ? "history-status-badge taken"

                                    : "history-status-badge warning"

                                }

                              >

                                <span>

                                  {item.medicineMatched

                                    ? "✓"

                                    : "!"}

                                </span>

                                {item.medicineMatched

                                  ? "Medicine Taken"

                                  : "Medicine Unknown"}

                              </span>

                            </td>

                          </tr>

                        )

                      )}

                    </tbody>

                  </table>

                </div>

                {/* Mobile Cards */}

                <div className="history-mobile-list">

                  {paginatedHistory.map(

                    (item) => (

                      <article

                        key={

                          item.id

                        }

                        className="history-mobile-card"

                      >

                        <div className="history-mobile-card-header">

                          <div className="history-mobile-medicine">

                            <div className="history-medicine-icon">

                              💊

                            </div>

                            <div>

                              <h3>

                                {

                                  item.medicineName

                                }

                              </h3>

                              <span>

                                {

                                  item.compartmentId

                                }

                              </span>

                            </div>

                          </div>

                          <span

                            className={

                              item.medicineMatched

                                ? "history-status-dot taken"

                                : "history-status-dot warning"

                            }

                          >

                            {item.medicineMatched

                              ? "✓"

                              : "!"}

                          </span>

                        </div>

                        <div className="history-mobile-details">

                          <div className="history-mobile-detail">

                            <span>

                              Date

                            </span>

                            <strong>

                              {formatLongDate(

                                item.date

                              )}

                            </strong>

                          </div>

                          <div className="history-mobile-detail">

                            <span>

                              Time

                            </span>

                            <strong>

                              {formatTime(

                                item.time

                              )}

                            </strong>

                          </div>

                          <div className="history-mobile-detail">

                            <span>

                              Compartment

                            </span>

                            <strong>

                              {

                                item.compartmentId

                              }

                            </strong>

                          </div>

                        </div>

                        <div

                          className={

                            item.medicineMatched

                              ? "history-mobile-status success"

                              : "history-mobile-status warning"

                          }

                        >

                          <span>

                            {item.medicineMatched

                              ? "✓"

                              : "!"}

                          </span>

                          {item.medicineMatched

                            ? "Medicine Taken"

                            : "Medicine could not be matched to a medication"}

                        </div>

                      </article>

                    )

                  )}

                </div>

                {totalPages > 1 && (

                  <div className="history-pagination">

                    <div className="history-pagination-info">

                      Showing{" "}

                      <strong>

                        {((currentPage - 1) * ITEMS_PER_PAGE) + 1}

                      </strong>

                      {" "}–{" "}

                      <strong>

                        {Math.min(

                          currentPage * ITEMS_PER_PAGE,

                          history.length

                        )}

                      </strong>

                      {" "}of{" "}

                      <strong>

                        {history.length}

                      </strong>

                      {" "}records

                    </div>

                    <div className="history-pagination-controls">

                      <button

                        type="button"

                        className="history-pagination-button"

                        disabled={currentPage === 1}

                        onClick={() =>

                          setCurrentPage(

                            currentPage - 1

                          )

                        }

                      >

                        ← Previous

                      </button>

                      <div className="history-pagination-pages">

                        {Array.from(

                          { length: totalPages },

                          (_, index) => {

                            const pageNumber = index + 1;

                            return (

                              <button

                                key={pageNumber}

                                type="button"

                                className={`history-pagination-page ${

                                  currentPage === pageNumber

                                    ? "active"

                                    : ""

                                }`}

                                onClick={() =>

                                  setCurrentPage(

                                    pageNumber

                                  )

                                }

                              >

                                {pageNumber}

                              </button>

                            );

                          }

                        )}

                      </div>

                      <button

                        type="button"

                        className="history-pagination-button"

                        disabled={

                          currentPage === totalPages

                        }

                        onClick={() =>

                          setCurrentPage(

                            currentPage + 1

                          )

                        }

                      >

                        Next →

                      </button>

                    </div>

                  </div>

                )}

              </section>

            )}

          </>

        )}

      </div>

    </div>

  );

}
