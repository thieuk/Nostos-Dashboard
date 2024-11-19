"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { signOut } from "next-auth/react";
import { toast } from 'react-toastify';

export default function Calendar() {
    const [mode, setMode] = useState("");
    const [id, setId] = useState("");
    const [title, setTitle] = useState("");
    const [newDate, setNewDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [events, setEvents] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/fetch-data");
            const file = await response.json();
            setEvents(file.data);
        }
        
        fetchData();
    }, []);

    const handleLogout = async () => { await signOut({ redirect: true, callbackUrl: "/login" }); };

    const updateData = async (data) => {
        const response = await fetch("/api/update-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    }

    const handleEventChange = (eventInfo) => {
        const updatedEvents = events.map(event => 
            event.id === eventInfo.event.id
                ? { ...event, start: eventInfo.event.startStr, end: eventInfo.event.endStr }
                : event
        );
        setEvents(updatedEvents); 
    };

    const generateUniqueId = () => {
        let newId;
        const existingIds = events.map(event => event.id);
    
        do {
            newId = Math.floor(1000 + Math.random() * 9000).toString();
        } while (existingIds.includes(newId));
    
        return newId;
    };

    const handleSelect = (info) => {
        setMode("add");
        setNewDate(info.startStr);

        if (info.view.type !== "dayGridMonth") {
            setMode("add-week");
            setStartTime(info.startStr);
            setEndTime(info.endStr);
            const addId = ["startTime", "endTime", "startTimeLabel", "endTimeLabel"];
            addId.forEach((ele) => { document.getElementById(ele).classList.add("hidden"); });
        }
        else {
            setMode("add-month");
            setStartTime("");
            setEndTime("");
            const removeId = ["startTime", "endTime", "startTimeLabel", "endTimeLabel"];
            removeId.forEach((ele) => { document.getElementById(ele).classList.remove("hidden"); });
        }

        document.getElementById("container").classList.add("h-screen", "overflow-hidden");
        document.getElementById("modal").classList.remove("hidden");
    };

    const handleDeleteEvent = (info) => {
        const eventDate = info.event.startStr.split("T")[0];
        const confirmDelete = confirm(`Do you want to delete the event with driver "${info.event.title}" on "${eventDate}"?`);
        if (confirmDelete) setEvents(events.filter(event => event.id !== info.event.id));
    };

    const handleEventClick = (info) => {
        const start = `${info.event.startStr.split("T")[1].split(":")[0]}:${info.event.startStr.split("T")[1].split(":")[1]}`;
        const end = `${info.event.endStr.split("T")[1].split(":")[0]}:${info.event.endStr.split("T")[1].split(":")[1]}`;
        setMode("edit");
        setId(info.event.id);
        setTitle(info.event.title);
        setNewDate(info.event.startStr.split("T")[0]);
        setStartTime(start);
        setEndTime(end);
        document.getElementById("container").classList.add("h-screen", "overflow-hidden");
        const removeId = ["startTime", "endTime", "startTimeLabel", "endTimeLabel", "modal"];
        removeId.forEach((ele) => { document.getElementById(ele).classList.remove("hidden"); });
    };

    const formatTime = (date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const period = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;

        return `${hours}:${minutes} ${period}`;
    };

    const renderEventContent = (eventInfo) => {
        const startTime = formatTime(new Date(eventInfo.event.start));
        const endTime = formatTime(new Date(eventInfo.event.end));
    
        return (
            <div className="relative w-full h-full font-bold p-1 cursor-pointer">
                <button className="close-bttn absolute top-0 right-0 bg-[#0B6134] m-1 text-white"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(eventInfo);
                    }}>
                    <span className="material-symbols-rounded">close</span>
                </button>
                <p>{`${startTime} - ${endTime}`}</p>
                <p>{eventInfo.event.title}</p>
            </div>
        );
    };

    const updateEvent = () => {
        try {
            const startDateTime = `${newDate}T${startTime}`;
            const endDateTime = `${newDate}T${endTime}`;

            if (startDateTime >= endDateTime) throw new Error("Invalid input. Event not updated.");
            else if (title.length < 1) throw new Error("Invalid input. Event not updated.");
            else if (title.length < 1) throw new Error("Invalid input. Event not updated.");

            if (mode === "edit") {
                const updatedEvent = {
                    id: id,
                    title: title,
                    start: startDateTime,
                    end: endDateTime,
                };

                setEvents(events.map(event => (event.id === id ? updatedEvent : event)));
            }
            else {
                if (mode.split("-")[1] === "month") {
                    const newEvent = {
                        id: generateUniqueId(),
                        title: title,
                        start: startDateTime,
                        end: endDateTime,
                    };
        
                    setEvents([...events, newEvent]);
                } else {
                    const newEvent = {
                        id: generateUniqueId(),
                        title: title,
                        start: startTime,
                        end: endTime,
                    };

                    setEvents([...events, newEvent]);
                }
            }
        } catch(error) {
            const errorMsg = error.message || "Invalid input. Event not updated.";
            toast.error(errorMsg, { style: { color: "black" } });
        } finally {
            closeModal();
        }
    }

    const closeModal = () => {
        setId("");
        setTitle("");
        setNewDate("");
        setStartTime("");
        setEndTime("");
        document.getElementById("modal").classList.add("hidden");
        document.getElementById("container").classList.remove("h-screen", "overflow-hidden");
    }
    
    return (
        <div>
            <div id="container" className="absolute w-full p-5 text-white z-1">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                    initialView="timeGridWeek"
                    scrollTime="00:00:00"
                    allDaySlot={false}
                    headerToolbar={{
                        left: "prev today next saveBttn logOutBttn",
                        center: "title",
                        right: "dayGridMonth timeGridWeek timeGridDay"
                    }}
                    customButtons={{
                        saveBttn: {
                            text: "Save Changes",
                            click: (event) => {
                                event.target.blur();
                                const newData = { "data" : events };
                                updateData(newData);
                                toast.success("Changes Saved.", { style: { color: "black"} }) 
                            },
                        },
                        logOutBttn: {
                            text: "Log Out",
                            click: (event) => {
                                event.target.blur();
                                handleLogout();
                            },
                        },
                    }}
                    events={events}
                    selectable={true}
                    editable={true}
                    eventDrop={handleEventChange}  
                    eventResize={handleEventChange}  
                    eventChange={handleEventChange}
                    select={handleSelect}
                    eventContent={renderEventContent}
                    eventClick={handleEventClick}
                    eventBackgroundColor="#0B6134"
                    eventBorderColor="#fff"
                    eventTextColor="#fff"
                />
            </div>
            <div id="modal" className="hidden absolute w-full h-full z-[99] bg-[#1c1c1cda] grid place-content-center">
                <div className="relative flex flex-col bg-[rgba(56,56,78,0.9)] border-2 rounded-lg px-14 py-10 shadow-[0_0_30px_black]">
                    <span id="close-modal" onClick={closeModal} className="material-symbols-rounded absolute top-3 right-3 text-white cursor-pointer">close</span>
                    <label htmlFor="title" className="font-bold text-white">DRIVER NAME</label> 
                    <input 
                        type="text" 
                        id="title" 
                        name="title" 
                        className="px-1 rounded" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} /> <br className={`${mode !== "edit" ? "hidden" : ""}`} />
                    <label htmlFor="date" className={`${mode !== "edit" ? "hidden" : ""} font-bold text-white`}>DATE [yyyy-mm-dd] </label>
                    <input 
                        type="text" 
                        id="date" 
                        name="date" 
                        className={`${mode !== "edit" ? "hidden" : ""} px-1 rounded`} 
                        value={newDate} 
                        onChange={(e) => setNewDate(e.target.value)} /> <br />
                    <label id="startTimeLabel" htmlFor="startTime" className="font-bold text-white">START TIME</label>
                    <input 
                        type="time" 
                        id="startTime" 
                        name="startTime" 
                        className="px-1 rounded"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)} /> <br />
                    <label id="endTimeLabel" htmlFor="endTime" className="font-bold text-white">END TIME</label> 
                    <input 
                        type="time" 
                        id="endTime" 
                        name="endTime" 
                        className="px-1 rounded"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)} /> <br />
                    <button onClick={updateEvent} className="bg-purple-700 px-2 py-1 text-white font-bold border-[1px] rounded">
                        {mode === "edit" ? "UPDATE INFORMATION" : "SCHEDULE DRIVER"}
                    </button>
                </div>
            </div>
        </div>
    );
}