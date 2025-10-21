import React, { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import BootstrapTheme from "@fullcalendar/bootstrap";
import { EventInput } from "@fullcalendar/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import fr from "date-fns/locale/fr"; // Locale française
import enUS from "date-fns/locale/en-US"; // Locale anglaise (États-Unis)
import Access from "../../utils/Access";
import { useSelector } from "react-redux";
// Enregistrer les locales
registerLocale("fr", fr);
registerLocale("en", enUS);

interface CalendarProps {
  onDateClick: (value: any) => void;
  onEventClick: (value: any) => void;
  onDrop: (value: any) => void;
  onEventDrop: (value: any) => void;
  events: EventInput[];
  handleAddEvent: () => void;
  changeMode:(value: any) => void;
  onChangeDate:(value: any) => void;
}

const Calendar = ({
  onDateClick,
  onEventClick,
  onDrop,
  onEventDrop,
  events,
  handleAddEvent,
  changeMode,
  onChangeDate
}: CalendarProps) => {
  const auth = useSelector((state: any) => state.Auth);
  const { t, i18n } = useTranslation();
  const calendarRef = useRef<any>(null); // Référence pour accéder à l'API FullCalendar
  const datePickerRef = useRef<HTMLDivElement>(null); // Référence pour le conteneur du DatePicker
  const [calenderDate, setCalenderDate] = useState(new Date()); // État pour la date sélectionnée
  const [currentView, setCurrentView] = useState("dayGridMonth"); // État pour la vue actuelle

  /*
   * Gestion du changement de date dans le DateTimePicker
   */
  const handleCalenderDate = (date: Date) => {
    setCalenderDate(date);
    onChangeDate(date)
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(date); // Naviguer vers la date sélectionnée dans le calendrier
    }
    
  };

  /*
   * Gestion du changement de vue (Month, Week, Day)
   */
  const handleViewChange = (view: any) => {
    setCurrentView(view.view.type); // Mettre à jour la vue actuelle
    console.log("Current View:", view.view.type); // Vous pouvez effectuer des actions spécifiques ici
    changeMode(view.view.type)
  };

  /*
   * Gestion du clic sur une date
   */
  const handleDateClick = (arg: any) => {
    setCalenderDate(arg.date); // Mettre à jour la date sélectionnée
    onDateClick(arg); // Appeler la fonction de rappel
  };

  /*
   * Gestion des clics sur les boutons Prev, Next et Today
   */
  const handleDatesSet = (arg: any) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate(); // Obtenir la date actuellement affichée
      setCalenderDate(currentDate); // Mettre à jour la date sélectionnée
    }
  };

  /*
   * Remplacer le bouton par le DatePicker après le rendu du calendrier
   */
  useEffect(() => {
    if (datePickerRef.current) {
      const buttonContainer = document.querySelector(
        ".fc-datePickerButton-button"
      ) as HTMLElement;
      if (buttonContainer) {
        buttonContainer.style.display = "none"; // Masquer le bouton
        buttonContainer.parentNode?.insertBefore(
          datePickerRef.current,
          buttonContainer
        ); // Insérer le DatePicker à la place du bouton
      }
    }
  }, []);

  return (
    <>
      {/* FullCalendar */}
      <div id="calendar">
        <FullCalendar
          ref={calendarRef} // Référence pour accéder à l'API FullCalendar
          initialView={currentView} // Utiliser la vue actuelle
          plugins={[
            dayGridPlugin,
            interactionPlugin,
            timeGridPlugin,
            listPlugin,
            BootstrapTheme,
          ]}
          handleWindowResize={true}
          themeSystem="bootstrap"
          buttonText={{
            today: t("today"),
            month: t("month"),
            week: t("week"),
            day: t("day"),
            list: t("list"),
            prev: t("prev"),
            next: t("next"),
          }}
          locale={i18n.language === "fr" ? "fr" : "en"}
          editable={false} // Désactive toutes les modifications
          selectable={true} // Désactive la sélection de plages de dates
          droppable={false} // Désactive le glisser-déposer externe
          events={events}
          dateClick={handleDateClick} // Gestion du clic sur une date
          eventClick={onEventClick}
          drop={onDrop}
          eventDrop={onEventDrop}
          // Configuration unique de la barre d'outils
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: `dayGridMonth,timeGridWeek,timeGridDay,datePickerButton,${Access(auth, 'HR') ? 'AddEvent' : null}` // Ajoutez le bouton personnalisé ici
          }}
          customButtons={{
            datePickerButton: {
              text: "", // Pas de texte, car nous affichons directement le DatePicker
              click: () => { }, // Pas besoin de clic
            },
            AddEvent: {
              text: t("Add Event"), // Pas de texte, car nous affichons directement le DatePicker
              click:handleAddEvent, // Pas besoin de clic
            },
          }}
          viewDidMount={handleViewChange} // Détecter les changements de vue
          datesSet={handleDatesSet} // Détecter les changements de date (Prev, Next, Today)
        />
      </div>

      {/* Conteneur pour le DatePicker */}
      <div
        ref={datePickerRef}
        style={{
          display: "inline-block",
          position: "relative", // Changé en relatif pour un meilleur contrôle
        }}
      >
        <DatePicker
          selected={calenderDate}
          onChange={handleCalenderDate}
          dateFormat="yyyy-MM-dd"
          showTimeInput
          required
          isClearable
          className="form-control datepicker-popper"
          placeholderText={t("select_date_and_time")}
          popperClassName="datepicker-popper" // Classe pour styliser le menu
          locale={i18n.language === "fr" ? fr : enUS} // Définir la locale en fonction de la langue
        />
      </div>

      {/* Style pour masquer le bouton et styliser le menu du DatePicker */}
      <style>
        {`
          .fc-datePickerButton-button {
            display: none !important; /* Masquer le bouton */
          }

          .datepicker-popper {
            z-index: 9999 !important; /* Assurez-vous que le menu est au-dessus de tout */
          }
        `}
      </style>
    </>
  );
};

export default Calendar;