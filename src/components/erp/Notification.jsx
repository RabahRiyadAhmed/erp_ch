import React, { useState, useEffect, useRef, useContext } from "react";
import { Link,useNavigate } from "react-router-dom";
import { Dropdown, Toast, ToastContainer } from "react-bootstrap";
import { AuthContext } from "../../helpers/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import ImageFetch from './ImageFetch';
//import { logout, updateToken,setNbnotif } from '../../redux/authSlice';
const NotificationDropdown = () => {
  const { auth, socket, setNbnotif, logout, updateToken } = useContext(AuthContext);
  const dispatch = useDispatch();
  const auth2 = useSelector((state) => state.Auth);
    const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [nbview,setNbview] = useState(0);
  const lastId = useRef(null); // Utilisation d'une référence pour lastId
  const containerRef = useRef(null);
  const displayedNotifications = useRef(new Set()); // Liste des notifications déjà affichées

  // Demander la permission pour les notifications
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          setPermissionGranted(true);
        }
      });
    } else if (Notification.permission === "granted") {
      setPermissionGranted(true);
    }
  }, []);

  // Écouter les notifications du socket
 
  useEffect(() => {
   console.log(auth.nbnotif)
    if (auth && socket) {
      const handleNotification = (data) => {
        console.log('notif')
        const nb = auth.nbnotif ? parseInt(auth.nbnotif) + 1 : 1;
        setNbview(nb)
          setNbnotif(nb);
        if (!displayedNotifications.current.has(data.id)) {
          
          // Affichage de la notification du navigateur
          if (Notification.permission === "granted") {
            new Notification(data.title, {
              body: data.message,
              icon: data.image,
            });
            displayedNotifications.current.add(data.id); // Marquer cette notification comme affichée
          }

          // Ajouter la notification à l'état
          setNotifications((prev) => [data, ...prev]);

          
        }
      };

      socket.on("notification", handleNotification);

      
    }
  }, [auth,socket, setNbnotif]);
 
  // Fonction pour récupérer les notifications
  const fetchNotifications = async () => {
    if (loading2 || !hasMore || !auth?.token) return;

    setLoading2(true);
    console.log("Fetching notifications...");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/notification/getList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ lastId: lastId.current, limit: 10 }),
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const data = await res.json();
      console.log("Response data:", data);

      if (data.status) {
        if (data.data.notifications.length === 0) {
          setHasMore(false);
          console.log("No more notifications to load.");
        } else {
          lastId.current = data.data.lastId;
          setNotifications((prev) => [...prev, ...data.data.notifications]);
        }
      } else {
        console.log("Error response:", data.message);
        if (data.message === "Token error") {
         logout();
        }
        setError(data.message || "Erreur inconnue du serveur");
      }

      if (data.token) {
       updateToken(data.token) ;
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Une erreur inattendue s'est produite.");
    } finally {
      setLoading2(false);
    }
  };

  // Détection du scroll pour charger plus de notifications
  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      fetchNotifications();
    }
  };

  // Charger les notifications initiales
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Ajouter l'écouteur de scroll
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [dropdownOpen]);

  // Basculer l'état du dropdown et émettre un événement socket si nécessaire
  const toggleDropdown = () => {
    if (dropdownOpen) {
      setNbnotif(0);
     
    }
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      <style jsx>{`
        .notification-scroll {
          max-height: 300px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #cccccc #f1f1f1;
        }

        .notification-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .notification-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .notification-scroll::-webkit-scrollbar-thumb {
          background-color: #cccccc;
          border-radius: 10px;
        }

        .notification-scroll::-webkit-scrollbar-thumb:hover {
          background-color: #999999;
        }

        .dropdown-item {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .notify-item img {
          flex-shrink: 0;
        }
      `}</style>

      <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
        <Dropdown.Toggle
          id="dropdown-notification"
          onClick={toggleDropdown}
          className="nav-link waves-effect waves-light notification-list"
        >
          <i className="fe-bell noti-icon font-22"></i>
          {nbview != 0 && (
            <span className="badge bg-danger rounded-circle noti-icon-badge">{nbview}</span>
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu dropdown-menu-end dropdown-menu-animated dropdown-lg py-0">
          <div>
            <div className="p-2">
              <h6 className="m-0 font-16 fw-semibold">Notifications</h6>
            </div>
            <div ref={containerRef} className="notification-scroll px-1">
              {notifications.map((item, i) => (
              <div
              className="dropdown-item notify-item"
              key={i}
              onClick={()=>{
                console.log(item)
                window.location.href = item.url;
               
              }}
            >
                  <div className="d-flex align-items-center" >
                    <ImageFetch
                      image={item.image}
                      alt=""
                      className="rounded-circle me-2"
                      style={{ width: "30px", height: "30px" }}
                      defaulBody={null}
                    />
                    <div>
                      <h5 className="font-14 mb-1">{item.title}</h5>
                      <small className="text-muted">{item.message}</small>
                    </div>
                  </div>
                  </div>
              ))}
              {loading2 && <p className="text-center">Loading...</p>}
              {error && <p className="text-center text-danger">{error}</p>}
            </div>
           
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default NotificationDropdown;