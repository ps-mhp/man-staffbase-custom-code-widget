# FAQ

**Pytanie:** Czy mój kod działa również w edytorze CMS podczas edycji?

Odpowiedź: Nie. Kod jest wykonywany wyłącznie na opublikowanej stronie oraz w
podglądzie. W edytorze widoczna jest natomiast karta zawierająca pierwsze wiersze
kodu. Dzięki temu błędny skrypt nie może zepsuć interfejsu,
w którym właśnie go poprawiasz.

**Pytanie:** W edytorze widzę tylko komunikat „Brak kodu. Edytuj w
ustawieniach widżetu”.

Odpowiedź: Widżet jest umieszczony, ale pusty. Otwórz ustawienia widżetu i
wpisz kod w edytorze kodu.

**Pytanie:** Mój skrypt ma obsługiwać element, który jeszcze w ogóle nie istnieje.

Odpowiedź: W panelu **Kod** po prawej stronie, pod opcją **Uruchom**, wybierz „Gdy strona zostanie w pełni
załadowana”. Wówczas skrypt poczeka, aż zawartość strony się ustabilizuje.

**Pytanie:** Mój CSS lub JavaScript nie działa.

Odpowiedź: Sprawdź po kolei: czy testowano to w **Podglądzie**, a nie
w edytorze? Czy panel **Sprawdzanie** zgłasza błąd? Czy po
**Zastosuj** ustawienia widżetu zostały zapisane? W przypadku JavaScriptu dodatkowo
otwórz konsolę przeglądarki opublikowanej strony — pojawiają się tam komunikaty takie jak
„JavaScript zawiera błąd składniowy i nie został wykonany” lub „JavaScript
nie powiodło się podczas wykonywania”.

**Pytanie:** Wyświetla się błąd składniowy — czy mimo to mogę zatwierdzić zmiany?

Odpowiedź: Tak, sprawdzanie niczego nie blokuje. Jest to wskazówka, a nie blokada.
Błędny kod JavaScript nie zostanie jednak w ogóle wykonany na stronie.

**Pytanie:** Mój kod CSS zmienia również inne obszary strony.

Odpowiedź: Tak ma być — kod CSS ma zasięg globalny. Jeśli chcesz zmienić tylko jeden obszar,
musisz odpowiednio zawęzić selektor.

**Pytanie:** Czy mogę umieścić na stronie kilka widżetów z kodem niestandardowym?

Odpowiedź: Tak. Każdy z nich zawiera własny kod CSS, który po usunięciu tego
widżetu znika, nie zakłócając działania pozostałych. Nie należy jednak polegać na
kolejności wykonywania skryptów —
zależności lepiej umieścić w jednym widżecie.

**Pytanie:** Dlaczego mój skrypt nie uruchamia się ponownie po zapisaniu?

Odpowiedź: Jeśli kod nie uległ zmianie, nie zostanie ponownie wykonany. Dopiero
rzeczywista zmiana w kodzie spowoduje ponowne uruchomienie skryptu.

**Pytanie:** Mój timer nadal działa, mimo że opuściłem stronę.

Odpowiedź: Przechodzenie do kolejnych elementów w aplikacji nie powoduje ponownego
załadowania strony. Dlatego w skrypcie należy zwrócić funkcję sprzątającą (patrz „Krok
po kroku”), która zakończy działanie timera i listenerów.

**Pytanie:** Kto może korzystać z tego widgetu?

Odpowiedź: Każda osoba, która ma uprawnienia do edycji strony — i może dzięki temu
dowolnie modyfikować stronę. Jest to zamierzone, ponieważ typowym powodem jest właśnie
element, który nie należy do samego widżetu. O tym, kto ma uprawnienia,
decyduje wyłącznie Staffbase.
