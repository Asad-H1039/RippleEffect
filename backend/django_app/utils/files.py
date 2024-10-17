from functools import partial
from hashlib import md5
from typing import IO


def hash_file(file: IO, block_size: int = 65536) -> str:
    hasher = md5()
    for buf in iter(partial(file.read, block_size), b""):
        hasher.update(buf)
    return hasher.hexdigest()
