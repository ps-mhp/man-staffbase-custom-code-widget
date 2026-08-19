# FAQ

**Pytanie:** Czy mój kod działa również w edytorze CMS podczas jego edycji?

Odpowiedź: Nie. Kod jest wykonywany wyłącznie na opublikowanej stronie oraz w
podglądzie. W widoku edycji wyświetla się natomiast karta z
pierwszymi wierszami zapisanej kodu — w przeciwnym razie błędny skrypt
zepsułby interfejs, w którym właśnie próbujemy go poprawić.

**Pytanie:** Kto może umieścić ten widget na stronie?

Odpowiedź: Każdy, kto posiada uprawnienia Staffbase do edycji strony, może
za pomocą tego widgetu dowolnie modyfikować stronę — jest to zamierzone, ponieważ
często chodzi właśnie o element, który nie należy do samego widgetu.
Uprawnienia do tego reguluje wyłącznie Staffbase, a nie sam widget.

**Pytanie:** Mój skrypt ma modyfikować element, który jednak jeszcze nie istnieje
— co zrobić?

Odpowiedź: W zakładce JavaScript należy zmienić moment uruchomienia na „Gdy strona zostanie w pełni
załadowana”. Dzięki temu skrypt poczeka, aż zawartość strony
się ustabilizuje, zamiast uruchamiać się natychmiast po wyrenderowaniu widżetu.

**Pytanie:** Moje CSS lub JavaScript nagle znikają?

Odpowiedź: Błąd składniowy nie blokuje zapisywania, ale jest wyświetlany w postaci
zwykłego tekstu pod edytorem — przed zamknięciem okna dialogowego
sprawdź tę informację. W przypadku błędów JavaScriptu występujących w czasie wykonywania warto dodatkowo zajrzeć do
konsoli przeglądarki na opublikowanej stronie.
