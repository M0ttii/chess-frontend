import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

export const CheckMateDialog = ( {open, setOpen, whoWins} : {open: any, setOpen: any, whoWins: any} ) => {

    const router = useRouter();
  
      function getWinSite() {
        console.log("whoResigns: " + whoWins)
          if (whoWins == "END_WHITE_IN_CHECKMATE") {
              return "Schwarz";
          } else {
              return "Weiß";
          }
      }
  
      function getLoseSite() {
          if (whoWins == "END_WHITE_IN_CHECKMATE") {
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
              <DialogTitle className="justify-center flex">{getWinSite()} hat gewonnen.</DialogTitle>
              <DialogDescription className="justify-center flex">
                {getLoseSite()} wurde Schach Matt gesetzt.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter className="sm:justify-center">
              <Button onClick={navigateToHome} className="" type="submit">Zurück</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    }