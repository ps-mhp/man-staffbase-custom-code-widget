# Ustawienia

Okno dialogowe konfiguracji zawiera pole **Kod**, którego nigdy nie edytuje się ręcznie.
Edycja odbywa się w edytorze kodu znajdującym się powyżej; przycisk **Edytuj kod**
otwiera go ponownie, a przycisk **Gotowe** przenosi aktualny stan do tego pola.

## Zakładki w edytorze kodu

| Zakładka | Opis |
| --- | --- |
| CSS | Jest wstawiany do strony jako arkusz stylów i dotyczy **całej strony**, a nie tylko obszaru widżetu. Jeśli widget zostanie usunięty, CSS również zniknie. |
| JavaScript | Działa z dostępem do `container` (elementu widgetu) i `widgetApi` (interfejsu Staffbase). |

## Czas rozpoczęcia („Uruchom:”, tylko w zakładce JavaScript)

| Wartość | Znaczenie |
| --- | --- |
| natychmiast po wyrenderowaniu | Ustawienie domyślne. Skrypt uruchamia się, gdy tylko pojawi się widget. Odpowiednie dla wszystkiego, co nie wymaga innych elementów strony. |
| po zakończeniu ładowania strony | Skrypt czeka, aż zawartość strony przestanie się zmieniać — dla skryptów, które modyfikują elementy ładowane później. W każdym przypadku uruchamia się najpóźniej po 5 sekundach. |

CSS obowiązuje w obu przypadkach natychmiast. Jest to zamierzone: dzięki temu strona
nie pojawia się na chwilę bez stylizacji.

## Pomoc w edytorze

| Funkcja | Opis |
| --- | --- |
| Sprawdzanie składni | Działa podczas pisania. Pod edytorem pojawia się komunikat „Nie znaleziono błędów składniowych” lub wskazanie miejsca błędu wraz z numerem linii. Nie **blokuje to zapisywania**. W przypadku CSS sprawdzana jest tylko struktura nawiasów, a nie każda właściwość. |
| Formatowanie | Automatycznie wyrównuje kod. |
