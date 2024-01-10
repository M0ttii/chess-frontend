import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export const ResignDialog = ( {open, setOpen, whoResigns} : {open: any, setOpen: any, whoResigns: any} ) => {

  const router = useRouter();

    function getWinSite() {
      console.log("whoResigns: " + whoResigns)
        if (whoResigns == "white") {
            return "Schwarz";
        } else {
            return "Weiß";
        }
    }

    function getLoseSite() {
        if (whoResigns == "white") {
            return "Weiß";
        } else {
            return "Schwarz";
        }
    }

    function navigateToHome() {
        setOpen(false);
        router.push("/")
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] p-10">
          <DialogHeader>
            <DialogTitle className="justify-center flex">{getWinSite()}</DialogTitle>
            <DialogDescription className="justify-center flex">
              {getLoseSite()} hat aufgegeben.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="sm:justify-center">
            <Button onClick={navigateToHome} className="" type="submit">Zurück</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

