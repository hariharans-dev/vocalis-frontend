"use client";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SearchBar } from "@/components/search-bar";
import {
  getEventData,
  getEventRole,
  updateEventData,
} from "@/app/api/event/EventData";
import { createEvent, deleteEvent } from "@/app/api/event/root/Event";
import { createCookie, getCookie, removeCookie } from "@/app/_functions/cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { setToken } from "@/app/api/Session";

export default function EventPage() {
  interface SearchItem {
    id: string;
    label: string;
  }

  interface CurrentEventData {
    name: string;
    endpoint?: string | null;
    event_detail: {
      location?: string | null;
      phone?: string | null;
      email?: string | null;
      description?: string | null;
      date?: string | null;
    };
  }

  interface NewEvent {
    event_name: string;
    description: string;
  }

  const [searchItems, setSearchItems] = useState<SearchItem[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [currentEventData, setCurrentEventData] = useState<CurrentEventData>({
    name: "",
    endpoint: null,
    event_detail: {
      location: "",
      phone: "",
      email: "",
      description: "",
      date: "",
    },
  });
  const [newEvent, setNewEvent] = useState<NewEvent>({
    event_name: "",
    description: "",
  });
  const [newEventError, setNewEventError] = useState("");
  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [userDataError, setUserDataError] = useState("");

  const filteredItems = searchQuery
    ? searchItems.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchItems;

  const EventRoleData = async () => {
    const response = await getEventRole();
    if (response?.data) {
      const items: SearchItem[] = response.data.map(
        (element: any, index: number) => ({
          id: `${index}`,
          label: element.event.name,
          role: element.role_list.name,
        })
      );
      setSearchItems(items);
    }
  };

  const EventData = async () => {
    const cookie: Object = await getCookie("event");

    if (cookie && "event" in cookie && "role" in cookie) {
      setRole(String(cookie.role));
      var response = await getEventData(String(cookie.event));
      if (response?.data) {
        setCurrentEventData({
          ...currentEventData,
          ...response.data,
        });
      }
    }
  };

  useEffect(() => {
    EventRoleData();
    EventData();
  });

  const createEventFunc = async () => {
    if (newEvent.event_name == "") {
      setNewEventError("event name missing");
    } else {
      const response = await createEvent(newEvent);
      if (response.status == "success") {
        setNewEventError(String(response.data?.response));
        createCookie("event", { event: newEvent.event_name, role: "root" });
        window.location.reload();
      } else {
        setNewEventError(String(response.error?.response));
      }
    }
  };

  const handleEventSelected = (item: any) => {
    setToken("event", JSON.stringify({ event: item.label, role: item.role }));
    window.location.reload();
  };

  const startEventEditing = () => {
    setIsEditing(true);
  };

  const updateEvent = async () => {
    let data: any = structuredClone(currentEventData);
    data["event_name"] = data.name;
    delete data.endpoint;
    delete data.name;

    data = {
      event_name: data.name,
      ...data,
      ...data.event_detail,
    };
    delete data.event_detail;

    const response = await updateEventData(data);
    if (response?.status == "error") {
      setUserDataError(response.error?.response ?? "error in updating");
    } else {
      setUserDataError("update successfull");
      await EventData();
    }
    setIsEditing(false);
  };

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (
      currentEventData.event_detail &&
      name in currentEventData.event_detail
    ) {
      setCurrentEventData({
        ...currentEventData,
        event_detail: {
          ...currentEventData.event_detail,
          [name]: value,
        },
      });
    } else {
      setCurrentEventData({
        ...currentEventData,
        [name]: value,
      });
    }
  };

  const handleDeleteEvent = async (event: string) => {
    const currentEvent = await getCookie("event");
    if (
      currentEvent &&
      "event" in currentEvent &&
      currentEvent.event == event
    ) {
      removeCookie("event");
    }
    await deleteEvent(event);
    window.location.reload();
  };

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div>
            <div className="flex items-center justify-between space-y-2 mb-3">
              <h2 className="text-2xl font-bold tracking-tight">
                Create Event
              </h2>
            </div>
            <Card className="col-span-4 p-4">
              <CardContent>
                <div className="space-y-3">
                  {" "}
                  <div className="flex items-center gap-2">
                    <Label htmlFor="new-event-name" className="w-24">
                      Event Name
                    </Label>
                    <Input
                      id="new-event-name"
                      type="text"
                      name="event_name"
                      value={newEvent.event_name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setNewEvent({
                          ...newEvent,
                          [e.target.name]: e.target.value,
                        });
                      }}
                      placeholder={newEvent.event_name}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="new-event-description" className="w-24">
                      Event Description
                    </Label>
                    <Input
                      id="new-event-description"
                      type="text"
                      name="description"
                      value={newEvent.description}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setNewEvent({
                          ...newEvent,
                          [e.target.name]: e.target.value,
                        });
                      }}
                      placeholder={newEvent.description}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {newEventError && (
                      <p className="text-red-500 text-sm">{newEventError}</p>
                    )}
                  </div>
                  <div className="mt-6">
                    <Button onClick={createEventFunc}>Create</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {currentEventData.name != "" && (
            <div>
              <div className="flex items-center justify-between space-y-2 mb-3">
                <h2 className="text-2xl font-bold tracking-tight">
                  Current Event
                </h2>
              </div>
              <Card className="col-span-4 p-4">
                <CardContent>
                  <div className="space-y-3">
                    {" "}
                    <div className="flex items-center gap-2">
                      <Label htmlFor="event-name" className="w-24">
                        Name
                      </Label>
                      <Input
                        id="event-name"
                        type="text"
                        name="name"
                        value={currentEventData.name}
                        onChange={handleEventChange}
                        placeholder={currentEventData.name}
                        disabled={!isEditing}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="event-endpoint" className="w-24">
                        Endpoint
                      </Label>
                      <Input
                        id="event-endpoint"
                        type="text"
                        name="endpoint"
                        value={currentEventData.endpoint || ""}
                        placeholder={currentEventData.endpoint || ""}
                        disabled={true}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="event-location" className="w-24">
                        Location
                      </Label>
                      <Input
                        id="event-location"
                        type="text"
                        name="location"
                        value={currentEventData.event_detail?.location || ""}
                        onChange={handleEventChange}
                        placeholder={
                          currentEventData.event_detail?.location || ""
                        }
                        disabled={!isEditing}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="event-date" className="w-24">
                        Date and Time
                      </Label>
                      <Input
                        id="event-date"
                        type="datetime-local"
                        name="date"
                        value={
                          currentEventData.event_detail?.date
                            ? currentEventData.event_detail.date.slice(0, 16)
                            : ""
                        }
                        onChange={handleEventChange}
                        placeholder={currentEventData.event_detail?.date || ""}
                        disabled={!isEditing}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="event-description" className="w-24">
                        Event Description
                      </Label>
                      <Input
                        id="event-description"
                        type="text"
                        name="description"
                        value={currentEventData.event_detail?.description || ""}
                        onChange={handleEventChange}
                        placeholder={
                          currentEventData.event_detail?.description || ""
                        }
                        disabled={!isEditing}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="event-email" className="w-24">
                        Event Email
                      </Label>
                      <Input
                        id="event-email"
                        type="text"
                        name="email"
                        value={currentEventData.event_detail?.email || ""}
                        onChange={handleEventChange}
                        placeholder={currentEventData.event_detail?.email || ""}
                        disabled={!isEditing}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="event-phone" className="w-24">
                        Event Phone
                      </Label>
                      <Input
                        id="event-phone"
                        type="text"
                        name="phone"
                        value={currentEventData.event_detail?.phone || ""}
                        onChange={handleEventChange}
                        placeholder={currentEventData.event_detail?.phone || ""}
                        disabled={!isEditing}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      {userDataError && (
                        <p className="text-red-500 text-sm">{userDataError}</p>
                      )}
                    </div>
                    {role == "root" && (
                      <div className="mt-6">
                        {!isEditing ? (
                          <Button onClick={startEventEditing}>Update</Button>
                        ) : (
                          <Button onClick={updateEvent}>Submit</Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-xl font-bold tracking-tight">Select Event</h2>
          </div>
          <SearchBar
            items={searchItems}
            query={searchQuery}
            onQueryChange={setSearchQuery}
            onSelect={handleEventSelected}
            filteredItems={filteredItems}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {filteredItems.map((item: any, index: number) => (
              <Card key={item.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="cursor-pointer"
                        onClick={(e) => e.stopPropagation()} // Prevents triggering Card click
                      >
                        <MoreHorizontal />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents accidental card selection
                          handleDeleteEvent(item.label);
                        }}
                        className="w-full text-left text-sm p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-800"
                      >
                        Delete Event
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents accidental card selection
                          handleEventSelected(item);
                        }}
                      >
                        Select Event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.label}</div>
                  <p className="text-xs text-muted-foreground">
                    Role assigned: {item.role}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
