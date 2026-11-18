# Ustawienia

Okno dialogowe konfiguracji otwiera edytor kodu w trybie pełnoekranowym. Pole
**Kod** znajdujące się za nim nigdy nie jest edytowane ręcznie; jeśli edytor jest zamknięty,
przycisk **Edytuj kod** ponownie go otwiera. **Zastosuj** zapisuje
aktualny stan w polu, **Anuluj** odrzuca go (z pytaniem potwierdzającym, jeśli coś
zostało zmienione). Zapisanie następuje dopiero wraz z ustawieniami widżetu.

## Zakładki nad obszarem kodu

| Zakładka | Opis |
| --- | --- |
| CSS | Jest wstawiany do strony jako arkusz stylów i dotyczy **całej strony**, a nie tylko obszaru widżetu. Jeśli widżet zostanie usunięty, CSS również zniknie. |
| JavaScript | Działa z dostępem do `container` (elementu widżetu) i `widgetApi` (interfejsu Staffbase). |

Czerwona liczba na zakładce wskazuje na błąd w tym języku.

## Wykonaj (panel „Kod” po prawej stronie)

| Opcja | Znaczenie |
| --- | --- |
| Natychmiast po wyrenderowaniu | Ustawienie domyślne. Skrypt uruchamia się, gdy tylko pojawi się widget. Odpowiednie dla wszystkiego, co nie wymaga innych elementów strony. |
| Po zakończeniu ładowania strony | Skrypt czeka, aż zawartość strony przestanie się zmieniać — przeznaczone dla skryptów, które modyfikują elementy ładowane później. W każdym przypadku uruchamia się najpóźniej po 5 sekundach. |

CSS obowiązuje natychmiast w obu przypadkach. Jest to zamierzone: dzięki temu strona
nie pojawia się na chwilę bez stylizacji.

## Pomoc w edytorze

| Funkcja | Opis |
| --- | --- |
| Sprawdzanie składni | Działa podczas pisania. Wiersz zawierający błąd jest podświetlony na czerwono, a komunikat znajduje się bezpośrednio pod nim. W panelu **Sprawdzanie** dla każdego języka widnieje komunikat „brak błędów” lub „1 błąd w wierszu …”; **Przejdź do miejsca błędu** przenosi do niego. Sprawdzanie **nie blokuje zapisywania**. W przypadku CSS sprawdzana jest tylko struktura nawiasów, a nie każda właściwość. |
| Pasek stanu | Pod kodem: język, liczba wierszy, błędy oraz pozycja kursora („wiersz 7, kolumna 32”). |
| Formatowanie | Automatycznie wyrównuje kod wybranego języka. Jeśli kod nie nadaje się do odczytania, pozostaje niezmieniony, a w pasku stanu podawany jest powód. |
| Cofnij | Strzałka w nagłówku cofa całe kroki edycji; w samym kodzie działa skrót ⌘/Ctrl Z edytora. |
| Pomoc | Znak zapytania w nagłówku (F1) wyjaśnia języki, czas rozpoczęcia i sprawdzanie. |
