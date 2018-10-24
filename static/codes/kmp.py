def the_thing(txt, pat):
    # allow indexing into pat and protect against change during yield
    pat = list(pat)

    # build table of shift amounts
    shifts = [1] * (len(pat) + 1)
    shift = 1
    for pos in range(len(pat)):
        while shift <= pos and pat[pos] != pat[pos-shift]:
            shift += shifts[pos-shift]
        shifts[pos+1] = shift

    # do the actual search
    startPos = 0
    matchLen = 0
    for c in txt:
        while matchLen == len(pat) or \
              matchLen >= 0 and pat[matchLen] != c:
            startPos += shifts[matchLen]
            matchLen -= shifts[matchLen]
        matchLen += 1
        if matchLen == len(pat):
            yield startPos
