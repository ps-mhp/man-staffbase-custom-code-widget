# Krok po kroku

## Dodawanie własnego kodu CSS

1. Umieść widżet **Kod niestandardowy** na stronie — jego położenie nie ma
   znaczenia, ponieważ jest niewidoczny. Zalecenie: umieść go na samym dole, aby nie
   przeszkadzał podczas edycji.
2. Otwórz ustawienia widżetu. Edytor kodu pojawi się w trybie pełnoekranowym;
   jeśli jest zamknięty, przycisk **Edytuj kod** ponownie go wyświetli.
3. Wybierz zakładkę **CSS** i wprowadź reguły.
4. Sprawdź pasek stanu pod kodem: jeśli widnieje tam napis „Brak błędów”, oznacza to, że
   struktura jest poprawna.
5. Kliknij **Zastosuj** w prawym górnym rogu i zapisz ustawienia widżetu
  .
6. Sprawdź wynik w **Podglądzie** — w edytorze kod CSS nie działa.

## Dodawanie własnego kodu JavaScript

1. Otwórz ustawienia widżetu i w edytorze kodu wybierz zakładkę **JavaScript**
  .
2. Wprowadź kod. Dostępne są `container` (element
   widżetu na stronie) oraz `widgetApi` (interfejs Staffbase).
3. W panelu **Kod** po prawej stronie, w sekcji **Uruchom**, wybierz moment uruchomienia —
   ustawienie domyślne „Natychmiast po renderowaniu”; w przypadku skryptów, które modyfikują istniejące
   elementy strony, „Gdy strona zostanie w pełni załadowana”.
4. Opcjonalnie kliknij **Formatuj**; kod zostanie automatycznie poprawnie
   wcięty.
5. W panelu w sekcji **Sprawdzanie** sprawdź, czy oba języki nie zgłaszają „żadnych błędów”,
   kliknij **Zastosuj** i zapisz ustawienia widżetu.
6. Sprawdź wynik w **Podglądzie**. Jeśli nic się nie dzieje, otwórz konsolę przeglądarki
   — błędy wykonania są tam rejestrowane.

## Nie zapomnij o sprzątaniu

Wszystko, co nadal działa — timery, detektory zdarzeń, obserwatory — musi zostać zakończone
, gdy tylko widget zniknie. W przeciwnym razie będą one nadal działać podczas dalszego poruszania się po
aplikacji, ponieważ strona nie zostanie przy tym ponownie załadowana.

1. W skrypcie zapisz bieżący element w zmiennej.
2. Na końcu zwróć funkcję, która go usunie:

   ```js
   const timer = setInterval(() => console.log("tick"), 1000);
   return () => clearInterval(timer);
   ```

Ta funkcja zostanie wywołana automatycznie po usunięciu widżetu.

## Jeśli coś pójdzie nie tak

1. W panelu **Kod** kliknij **Przejdź do miejsca błędu** — edytor przełączy się na
   zakładkę z błędem i przejdzie do odpowiedniej linii; komunikat znajduje się bezpośrednio
   pod nią. Czerwona liczba na zakładce wskazuje, którego języka dotyczy błąd.
2. Jeśli to nie pomoże, skopiuj kod do schowka, a następnie wyczyść schowek,
   po czym kliknij **Zastosuj** i zapisz.
3. Sprawdź, czy strona znów działa poprawnie, a następnie
   wstawaj kod krok po kroku.
