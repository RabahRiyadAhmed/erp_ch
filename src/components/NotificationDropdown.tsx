import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import classNames from "classnames";

// interface
import { NotificationItem } from "../layouts/Topbar";

interface NotificationDropdownProps {
  notifications: Array<NotificationItem>;
}

const NotificationDropdown = (props: NotificationDropdownProps) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [notificationContentStyle, setNotificationContentStyle] = useState<React.CSSProperties>({
    maxHeight: "300px",
    overflowY: "auto",
    display: "none",
  });

  const containerRef = useRef<HTMLDivElement>(null); // Référence pour le conteneur
  const [containerSize, setContainerSize] = useState({
    visibleHeight: 0, // Hauteur visible
    totalHeight: 0,   // Hauteur totale du contenu
  });
  const [scrollPosition, setScrollPosition] = useState(0); // Position du scroll

  // Met à jour la taille du conteneur et du contenu
  useEffect(() => {
    if (containerRef.current) {
      setContainerSize({
        visibleHeight: containerRef.current.offsetHeight, // Hauteur visible (conteneur)
        totalHeight: containerRef.current.scrollHeight,  // Hauteur totale (contenu défilable)
      });
      
    }
  }, [dropdownOpen]);

  // Gère la position du scroll
  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollTop); // Position actuelle du scroll
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setNotificationContentStyle((prevStyle) => ({
      ...prevStyle,
      display: prevStyle.display === "none" ? "block" : "none",
    }));
  };

  const handleClearNotification = (index: number) => {
    const updatedNotifications = [...props.notifications];
    updatedNotifications.splice(index, 1);
    // Notify parent about the change if needed
  };

  return (
    <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
      <Dropdown.Toggle
        id="dropdown-notification"
        role="button"
        as="a"
        onClick={toggleDropdown}
        className={classNames("nav-link waves-effect waves-light arrow-none notification-list", {
          show: dropdownOpen,
        })}
      >
        <i className="fe-bell noti-icon font-22"></i>
        <span className="badge bg-danger rounded-circle noti-icon-badge">9</span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu dropdown-menu-end dropdown-menu-animated dropdown-lg py-0">
        <div onClick={toggleDropdown}>
          <div className="p-2 border-top-0 border-start-0 border-end-0 border-dashed border">
            <div className="row align-items-center">
              <div className="col">
                <h6 className="m-0 font-16 fw-semibold">Notification</h6>
              </div>
              <div className="col-auto">
                <Link to="#" className="text-dark text-decoration-underline">
                  <small>Clear All</small>
                </Link>
              </div>
            </div>
          </div>

          {/* Conteneur des notifications */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="px-1"
            style={notificationContentStyle}
          >
            <h5 className="text-muted font-13 fw-normal mt-2">Today</h5>
            {(props.notifications || []).map((item, i) => {
              return (
                <Link
                  to="#"
                  className="dropdown-item p-0 notify-item card unread-noti shadow-none mb-1"
                  key={i + "-noti"}
                >
                  {item.avatar ? (
                    <div className="card-body">
                      <span
                        className="float-end noti-close-btn text-muted"
                        onClick={() => handleClearNotification(i)}
                      >
                        <i className="mdi mdi-close"></i>
                      </span>
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="notify-icon">
                            <img
                              src={item.avatar}
                              alt=""
                              className="img-fluid rounded-circle"
                            />
                          </div>
                        </div>
                        <div className="flex-grow-1 text-truncate ms-2">
                          <h5 className="noti-item-title fw-semibold font-14">
                            {item.text}
                            <small className="fw-normal text-muted ms-1">
                              {item.text}
                            </small>
                          </h5>
                          <small className="noti-item-subtitle text-muted">
                            {item.subText}
                          </small>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="card-body">
                      <span
                        className="float-end noti-close-btn text-muted"
                        onClick={() => handleClearNotification(i)}
                      >
                        <i className="mdi mdi-close" />
                      </span>
                      <div className={`notify-icon bg-${item.bgColor}`}>
                        <i className={item.icon}></i>
                      </div>
                      <p className="notify-details">
                        {item.text}
                        <small className="noti-item-subtitle text-muted">
                          {item.subText}
                        </small>
                      </p>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          <Link
            to="#"
            className="dropdown-item text-center text-primary notify-item notify-all"
          >
            {/* Affiche la taille et la position */}
            <div className="mb-2">
              <p>
                <strong>Hauteur visible:</strong> {containerSize.visibleHeight}px
              </p>
              <p>
                <strong>Hauteur totale:</strong> {containerSize.totalHeight}px
              </p>
              <p>
                <strong>Position scroll:</strong> {scrollPosition}px
              </p>
            </div>
            View All <i className="fe-arrow-right"></i>
          </Link>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDropdown;
