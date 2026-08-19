# Veelgestelde vragen

**Vraag:** Werkt mijn code ook in de CMS-editor terwijl ik deze bewerk?

Antwoord: Nee. De code wordt alleen uitgevoerd op de gepubliceerde pagina en in het
voorbeeld. In de editor ziet u in plaats daarvan een kaart met de eerste regels
van uw code. Zo kan een foutief script de interface niet ontregelen
waarin u het op dat moment aan het corrigeren bent.

**Vraag:** Ik zie in de editor alleen „Nog geen code ingevoerd. Bewerk via de
widget-instellingen.“

Antwoord: De widget is geplaatst, maar leeg. Open de widgetinstellingen en
voer de code in de code-editor in.

**Vraag:** Mijn script moet een element bewerken dat er nog helemaal niet is.

Antwoord: Schakel in het tabblad JavaScript bij **Uitvoeren:** over naar „wanneer de pagina volledig
is geladen“. Dan wacht het script tot de pagina-inhoud is
gestabiliseerd.

**Vraag:** Mijn CSS of JavaScript werkt niet.

Antwoord: Controleer het volgende stap voor stap: Is er getest in het **Voorbeeld** en niet
in de editor? Staat er een foutmelding onder de editor? Is na **Klaar**
ook de widgetinstelling opgeslagen? Open bij JavaScript bovendien de
browserconsole van de gepubliceerde pagina — daar staan meldingen zoals
„Het JavaScript heeft een syntaxfout en is niet uitgevoerd“ of „Het
JavaScript is mislukt bij het uitvoeren“.

**Vraag:** Er wordt een syntaxfout weergegeven — kan ik toch opslaan?

Antwoord: Ja, de controle blokkeert niets. Het is een aanwijzing, geen blokkering.
Foutief JavaScript wordt echter helemaal niet uitgevoerd op de pagina.

**Vraag:** Mijn CSS verandert ook andere delen van de pagina.

Antwoord: Dat is de bedoeling — de CSS geldt globaal. Wie slechts één deel
wil beïnvloeden, moet de selector dienovereenkomstig nauwkeurig instellen.

**Vraag:** Kan ik meerdere Custom Code-widgets op één pagina plaatsen?

Antwoord: Ja. Elk widget heeft zijn eigen CSS, die bij het verwijderen van dit
widget ook weer verdwijnt, zonder de andere te verstoren. Je moet echter niet vertrouwen op de
uitvoeringsvolgorde van de scripts —
het is beter om afhankelijkheden in één enkel widget onder te brengen.

**Vraag:** Waarom wordt mijn script na het opslaan niet opnieuw uitgevoerd?

Antwoord: Bij ongewijzigde code wordt het script niet opnieuw uitgevoerd. Pas een
daadwerkelijke wijziging in de code start het script opnieuw.

**Vraag:** Mijn timer loopt door, ook al heb ik de pagina verlaten.

Antwoord: Als je binnen de app verder klikt, wordt de pagina niet opnieuw
geladen. Geef daarom in het script een opruimfunctie terug (zie „Stap
voor stap“), die de timer en de listener beëindigt.

**Vraag:** Wie mag deze widget gebruiken?

Antwoord: Iedereen die de pagina mag bewerken — en daarmee kan de
pagina naar believen wijzigen. Dit is opzettelijk, want de gebruikelijke aanleiding is juist
een element dat niet tot de widget zelf behoort. Wie de bevoegdheid heeft,
wordt uitsluitend door Staffbase bepaald.
