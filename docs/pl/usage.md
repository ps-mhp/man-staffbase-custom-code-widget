# Krok po kroku

## Dodawanie własnego kodu CSS

1. Umieść widget **Kod niestandardowy** na stronie — jego położenie nie ma
   znaczenia, ponieważ jest niewidoczny. Zalecenie: umieść go na samym dole, aby nie przeszkadzał podczas
   edycji.
2. Otwórz ustawienia widżetu. Pojawi się edytor kodu; jeśli jest
   zamknięty, przycisk **Edytuj kod** spowoduje jego ponowne wyświetlenie.
3. Wybierz zakładkę **CSS** i wprowadź reguły.
4. Sprawdź komunikat pod edytorem: jeśli widnieje tam „Nie znaleziono błędów składniowych
”, struktura jest poprawna.
5. Kliknij **Gotowe** i zapisz ustawienia widżetu.
6. Sprawdź wynik w **Podglądzie** — w edytorze kod CSS nie działa.

## Dodawanie własnego kodu JavaScript

1. Otwórz ustawienia widżetu i w edytorze kodu wybierz zakładkę **JavaScript**
  .
2. Wprowadź kod. Dostępne są `container` (element
   widżetu na stronie) oraz `widgetApi` (interfejs Staffbase).
3. W polu **Uruchom:** wybierz moment rozpoczęcia — domyślnie „natychmiast po
   wyrenderowaniu”; w przypadku skryptów, które modyfikują istniejące elementy strony, „gdy
   strona zostanie w pełni załadowana”.
4. Opcjonalnie kliknij **Formatuj**; kod zostanie automatycznie poprawnie
   wcięty.
5. Sprawdź komunikat pod edytorem, kliknij **Gotowe** i zapisz
   ustawienia widżetu.
6. Sprawdź wynik w **Podglądzie**. Jeśli nic się nie dzieje, otwórz konsolę przeglądarki
   — błędy wykonania są tam rejestrowane.

## Nie zapomnij o sprzątaniu

Wszystko, co nadal działa — timery, detektory zdarzeń, obserwatory — musi zostać zakończone
, gdy tylko widget zniknie. W przeciwnym razie będą one nadal działać podczas dalszego poruszania się po
aplikacji, ponieważ strona nie zostanie przy tym ponownie załadowana.

1. W skrypcie zapisz bieżący element w zmiennej.
2. Na końcu zwróć funkcję, która to wszystko wyczyści:

   ```js
   const timer = setInterval(() => console.log("tick"), 1000);
   return () => clearInterval(timer);
   ```

Ta funkcja zostanie wywołana automatycznie po usunięciu widżetu.

## Jeśli coś pójdzie nie tak

1. Otwórz kartę z błędnym kodem i przeczytaj komunikat pod
   edytorem — podaje on numer linii.
2. Jeśli to nie pomoże, skopiuj zawartość pola
   i wyczyść kod, a następnie kliknij **Gotowe** i zapisz.
3. Sprawdź, czy strona znów działa normalnie, a następnie
   wstawaj kod krok po kroku.
