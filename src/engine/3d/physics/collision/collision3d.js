function onCollideCube3d(x1, y1, z1, w1, h1, d1, x2, y2, z2, w2, h2, d2) {
    return ( x1 < x2 + w2 and x1 + w1 > x2 and 
             y1 < y2 + h2 and y1 + h1 > y2 and
             z1 < z2 + d2 and z1 + d1 > z2 )
}