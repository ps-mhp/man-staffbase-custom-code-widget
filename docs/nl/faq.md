# Veelgestelde vragen

**Vraag:** Wordt mijn code ook uitgevoerd in de CMS-editor terwijl ik deze bewerk?

Antwoord: Nee. De code wordt alleen uitgevoerd op de gepubliceerde pagina en in het
voorbeeld. In de bewerkingsweergave zie je in plaats daarvan een kaart met de
eerste regels van de opgeslagen code — een foutief script zou anders
de interface kapotmaken waarin je het juist wilt corrigeren.

**Vraag:** Wie mag deze widget op een pagina plaatsen?

Antwoord: Wie de Staffbase-toestemming heeft om de pagina te bewerken, kan
de pagina via deze widget naar believen wijzigen — dat is de bedoeling, want de
meest voorkomende reden is juist een element dat niet tot de widget zelf behoort.
De bevoegdheid hiervoor wordt uitsluitend door Staffbase geregeld, niet door de widget.

**Vraag:** Mijn script moet een element bewerken dat er nog helemaal niet
is — wat moet ik doen?

Antwoord: Stel in het tabblad JavaScript het starttijdstip in op „Wanneer de pagina volledig
is geladen”. Zo wacht het script tot de pagina-inhoud
stabiel is, in plaats van direct te worden uitgevoerd bij het renderen van de widget.

**Vraag:** Mijn CSS of JavaScript verdwijnt plotseling?

Antwoord: Een syntaxfout blokkeert het opslaan niet, maar wordt onder de
editor in leesbare tekst weergegeven — controleer de melding voordat je het dialoogvenster
sluit. Bij JavaScript-fouten tijdens de uitvoering is het bovendien de moeite waard om een kijkje te nemen in de
browserconsole van de gepubliceerde pagina.
