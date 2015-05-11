/**
 * eGov suite of products aim to improve the internal efficiency,transparency,
   accountability and the service delivery of the government  organizations.

    Copyright (C) <2015>  eGovernments Foundation

    The updated version of eGov suite of products as by eGovernments Foundation
    is available at http://www.egovernments.org

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see http://www.gnu.org/licenses/ or
    http://www.gnu.org/licenses/gpl.html .

    In addition to the terms of the GPL license to be adhered to in using this
    program, the following additional terms are to be complied with:

	1) All versions of this program, verbatim or modified must carry this
	   Legal Notice.

	2) Any misrepresentation of the origin of the material is prohibited. It
	   is required that all modified versions of this material be marked in
	   reasonable ways as different from the original version.

	3) This license does not grant any rights to any user of the program
	   with regards to rights under trademark law for use of the trade names
	   or trademarks of eGovernments Foundation.

  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */
package org.egov.pgr.web.controller.complaint;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;
import static org.mockito.MockitoAnnotations.initMocks;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.flash;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.egov.infra.admin.master.entity.Boundary;
import org.egov.infra.admin.master.entity.Department;
import org.egov.infra.admin.master.entity.Role;
import org.egov.infra.admin.master.entity.User;
import org.egov.infra.admin.master.service.BoundaryService;
import org.egov.infra.admin.master.service.DepartmentService;
import org.egov.infra.admin.master.service.UserService;
import org.egov.infstr.client.filter.EGOVThreadLocals;
import org.egov.pgr.entity.Complaint;
import org.egov.pgr.entity.ComplaintStatus;
import org.egov.pgr.entity.ComplaintType;
import org.egov.pgr.service.ComplaintService;
import org.egov.pgr.service.ComplaintStatusMappingService;
import org.egov.pgr.service.ComplaintStatusService;
import org.egov.pgr.service.ComplaintTypeService;
import org.egov.pgr.web.controller.AbstractContextControllerTest;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.Matchers;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.SmartValidator;
import org.springframework.web.util.NestedServletException;

@Ignore
public class ComplaintUpdationControllerTest extends AbstractContextControllerTest<ComplaintUpdationController> {
    @Mock
    private Complaint complaint;
    @Mock
    private ComplaintService complaintService;
    @Mock
    private BoundaryService boundaryService;

    @Mock
    private ComplaintStatusService complaintStatusService;

    @Mock
    ComplaintStatusMappingService complaintStatusMappingService;

    @Mock
    private SmartValidator smartValidator;

    @Autowired
    private SmartValidator validator;

    @Mock
    private DepartmentService departmentService;

    private MockMvc mockMvc;
    @Mock
    ComplaintTypeService complaintTypeService;

    private Long id;
    private ComplaintType complaintType;

    @Mock
    Complaint complaint1;

    @Mock
    BindingResult errors;

    @Mock
    UserService userService;

    @Mock
    User user;

    @Override
    protected ComplaintUpdationController initController() {
        initMocks(this);

        final ComplaintUpdationController complaintUpdationController = new ComplaintUpdationController(complaintService,
                complaintTypeService, complaintStatusMappingService, smartValidator);
        // when(complaintUpdationController.getStatus()).thenReturn(value,
        // values);

        return complaintUpdationController;
    }

    @Before
    public void before() {

        mockMvc = mvcBuilder.build();
        complaint = new Complaint();
        complaint.setDetails("Already Registered complaint");
        // id = 2L;
        when(complaintService.getComplaintById(id)).thenReturn(complaint);

        complaintType = new ComplaintType();
        final List ctList = new ArrayList<ComplaintType>();
        ctList.add(complaintType);
        when(complaintTypeService.findAll()).thenReturn(ctList);

        final List<ComplaintStatus> csList = new ArrayList<ComplaintStatus>();
        final ComplaintStatus cs = new ComplaintStatus();

        final Role r = new Role();
        final Set<Role> roleList = new HashSet<Role>();
        roleList.add(r);
        EGOVThreadLocals.setUserId(1l);
        when(userService.getUserById(Matchers.anyLong())).thenReturn(user);
        when(user.getRoles()).thenReturn(roleList);
        csList.add(cs);
        final List<Department> departmentList = new ArrayList<Department>();
        when(departmentService.getAllDepartments()).thenReturn(departmentList);

        when(complaintStatusMappingService.getStatusByRoleAndCurrentStatus(roleList, cs)).thenReturn(csList);

    }

    @Test(expected = NestedServletException.class)
    public void editWithInvalidComplaintId() throws Exception {
        complaint = new Complaint();
        complaintType.setLocationRequired(false);
        complaint.setComplaintType(complaintType);
        complaint.setDetails("Already Registered complaint");
        mockMvc.perform(get("/complaint-update?id=1")).andReturn();
    }

    @Test
    public void editWithComplaintTypeLocationRequiredFalse() throws Exception {
        complaint = new Complaint();
        complaintType.setLocationRequired(false);
        complaint.setComplaintType(complaintType);
        complaint.setDetails("Already Registered complaint");
        when(complaintService.getComplaintById(id)).thenReturn(complaint);

        final MvcResult result = mockMvc.perform(get("/complaint-update?id=2")).andExpect(view().name("complaint-edit"))
                .andExpect(model().attributeExists("complaint")).andReturn();

        final Complaint existing = (Complaint) result.getModelAndView().getModelMap().get("complaint");
        assertEquals(complaint.getDetails(), existing.getDetails());

    }

    @Test
    public void editWithComplaintTypeLocationRequiredTrue() throws Exception {
        complaint = new Complaint();
        complaintType.setLocationRequired(true);
        complaint.setComplaintType(complaintType);
        complaint.setDetails("Already Registered complaint");
        id = 2L;
        when(complaintService.getComplaintById(id)).thenReturn(complaint);

        final MvcResult result = mockMvc.perform(get("/complaint-update?id=2")).andExpect(status().isOk())
                .andExpect(view().name("complaint-edit")).andExpect(model().attributeExists("complaint")).andReturn();

        final Complaint existing = (Complaint) result.getModelAndView().getModelMap().get("complaint");
        assertEquals(complaint.getDetails(), existing.getDetails());

    }

    @Test
    public void editWithBoundary() throws Exception {
        complaint = new Complaint();
        complaintType.setLocationRequired(true);
        complaint.setComplaintType(complaintType);
        complaint.setDetails("Already Registered complaint");
        final Boundary ward = new Boundary();
        final Boundary zone = new Boundary();

        try {
            Field idField = ward.getClass().getSuperclass().getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(ward, id);
            idField = zone.getClass().getSuperclass().getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(zone, id);
        } catch (final Exception e) {
            throw new RuntimeException(e);
        }
        ward.setParent(zone);

        complaint.setLocation(ward);
        id = 2L;
        when(complaintService.getComplaintById(id)).thenReturn(complaint);
        final List<Boundary> wards = new ArrayList<Boundary>();
        when(boundaryService.getChildBoundariesByBoundaryId(ward.getId())).thenReturn(wards);

        final MvcResult result = mockMvc.perform(get("/complaint-update?id=2")).andExpect(status().isOk())
                .andExpect(view().name("complaint-edit")).andExpect(model().attributeExists("complaint")).andReturn();

        final Complaint existing = (Complaint) result.getModelAndView().getModelMap().get("complaint");
        assertEquals(complaint.getDetails(), existing.getDetails());

    }

    @Test
    public void updateWithoutComplaintType() throws Exception {
        final ComplaintStatus cs1 = new ComplaintStatus();
        complaint1.setStatus(cs1);
        complaintType.setLocationRequired(true);
        complaint1.setComplaintType(complaintType);
        complaint1.setDetails("Already Registered complaint");
        id = 2L;
        when(complaintService.getComplaintById(id)).thenReturn(complaint1);
        when(complaint1.getId()).thenReturn(2L);
        mockMvc.perform(post("/complaint-update").param("id", "2").param("complaintStatus", "2")).andDo(print())
                .andExpect(status().is3xxRedirection()).andReturn();

    }

    @Ignore
    // Ignoring test now since domain class conversion is not incorporated
    public void updateWithComplaintType() throws Exception {

        final ComplaintStatus cs = new ComplaintStatus();
        cs.setName("Forwarded");
        complaint1.setStatus(cs);
        complaintType.setLocationRequired(true);
        complaint1.setComplaintType(complaintType);
        complaint1.setDetails("Already Registered complaint");
        id = 2L;
        when(complaintService.getComplaintById(id)).thenReturn(complaint1);
        when(complaint1.getId()).thenReturn(2L);
        when(complaintTypeService.load(id)).thenReturn(complaintType);
        mockMvc.perform(post("/complaint-update").param("id", "2").param("complaintStatus", "2").param("complaintType", "2"))
                .andExpect(flash().attributeExists("message")).andExpect(status().is3xxRedirection()).andReturn();

    }

}