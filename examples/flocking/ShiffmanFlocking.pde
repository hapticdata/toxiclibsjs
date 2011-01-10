/**
 * <p>Flocking by <a href="http://www.shiffman.net">Daniel Shiffman</a>
 * created for The Nature of Code class, ITP, Spring 2009.</p>
 * 
 * <p>Ported to toxiclibs by Karsten Schmidt</p>
 * 
 * <p>Demonstration of <a href="http://www.red3d.com/cwr/">Craig Reynolds' "Flocking" behavior</a><br/>
 * <p>Rules: Cohesion, Separation, Alignment</p>
 * 
 * <p><strong>Usage:</strong> Click mouse to add boids into the system</p>
 */

/* 
 * Copyright (c) 2009 Daniel Shiffman
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 * 
 * http://creativecommons.org/licenses/LGPL/2.1/
 * 
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */
 
import toxi.geom.*;
import toxi.math.*;

Flock flock;

void setup() {
  size(600,200);
  flock = new Flock();
  // Add an initial set of boids into the system
  for (int i = 0; i < 100; i++) {
    flock.addBoid(new Boid(new Vec2D(width/2,height/2),3.0,0.05));
  }
  smooth();
}

void draw() {
  background(255);
  flock.run();
}

// Add a new boid into the System
void mousePressed() {
  flock.addBoid(new Boid(new Vec2D(mouseX,mouseY),2.0,0.05f));
}

