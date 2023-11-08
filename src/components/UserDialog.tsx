
'use client'
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { User } from "@/model/User";



const UserDialog = ( {open, setOpen} : {open: any, setOpen: any} ) => {
    const [username, setUsername] = useState('');
    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
      
        try {
          // Warten auf die Antwort des Fetch-Vorgangs.
          const response = await fetch("http://localhost:8080/user", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username })
          });
      
          // Überprüfen, ob der HTTP-Statuscode erfolgreich ist (z.B. 200).
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          // Warten auf die Verarbeitung der Antwort zu JSON.
          const data = await response.json();
          console.log(data);
      
          // Verwenden Sie die Antwortdaten wie gewünscht...
          localStorage.setItem("id", data.id); // Speichern der ID aus der Antwort, nicht den Username.
      
          // Schließen Sie das Dialogfenster, wenn die Anfrage erfolgreich war.
          setOpen(false);
        } catch (error) {
          // Hier können Sie den Fehler loggen oder Benutzer über den Fehler informieren.
          console.error('There was a problem with the fetch operation:', error);
        }
      }
      

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value); // Aktualisieren des Zustands mit dem neuen Wert
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            
            <DialogContent className="dark absolute">

                <DialogHeader>
                    <DialogTitle>Choose username</DialogTitle>
                    <DialogDescription>This username will be displayed to other users</DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <Input
                        id="link"
                        placeholder="John Ulrich"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <form onSubmit={onSubmit}>
                    <DialogFooter className="sm:justify-start">
                        <Button type="submit" variant="secondary">
                            Set
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UserDialog;