/*
 * Copyright (c) 2015 Memorial Sloan-Kettering Cancer Center.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS
 * FOR A PARTICULAR PURPOSE. The software and documentation provided hereunder
 * is on an "as is" basis, and Memorial Sloan-Kettering Cancer Center has no
 * obligations to provide maintenance, support, updates, enhancements or
 * modifications. In no event shall Memorial Sloan-Kettering Cancer Center be
 * liable to any party for direct, indirect, special, incidental or
 * consequential damages, including lost profits, arising out of the use of this
 * software and its documentation, even if Memorial Sloan-Kettering Cancer
 * Center has been advised of the possibility of such damage.
 */

/*
 * This file is part of cBioPortal.
 *
 * cBioPortal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

package org.mskcc.cbio.portal.scripts;

// imports
import org.mskcc.cbio.portal.model.User;
import org.mskcc.cbio.portal.dao.DaoUser;
import org.mskcc.cbio.portal.model.UserAuthorities;
import org.mskcc.cbio.portal.dao.DaoUserAuthorities;
import org.mskcc.cbio.portal.scripts.ResetDatabase;
import org.mskcc.cbio.portal.scripts.ImportUsers;

import junit.framework.TestCase;

/**
 * JUnit test for ImportUsers class.
 */
public class TestImportUsers extends TestCase {
   
   public void testImportUsers() throws Exception{

      ResetDatabase.resetDatabase();
      // TBD: change this to use getResourceAsStream()
      String args[] = {"target/test-classes/test-users.txt"};
      ImportUsers.main(args);

      User user = DaoUser.getUserByEmail("Dhorak@yahoo.com");
      assertTrue(user != null);
      assertTrue(user.isEnabled());
      UserAuthorities authorities = DaoUserAuthorities.getUserAuthorities(user);
      assertTrue(authorities.getAuthorities().contains("ROLE_MANAGER"));

      user = DaoUser.getUserByEmail("Lonnie@openid.org");
      assertTrue(user != null);
      assertFalse(user.isEnabled());
      authorities = DaoUserAuthorities.getUserAuthorities(user);
      assertEquals(authorities.getAuthorities().size(), 1);
      DaoUserAuthorities.removeUserAuthorities(user);
      assertEquals(DaoUserAuthorities.getUserAuthorities(user).getAuthorities().size(), 0);
   }
}
